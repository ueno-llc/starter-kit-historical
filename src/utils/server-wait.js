import { autorun, toJS, extendObservable, asMap } from 'mobx';
import { fromPromise } from 'mobx-utils';
import ReactDOMServer from 'react-dom/server';
import stringify from 'json-stringify-safe';
import _once from 'lodash/once';
import _debounce from 'lodash/debounce';


const serverWaitProxy = ({ maxWait }) =>
  function serverWaitMethod(target, name, descriptor) {
    const method = descriptor.value;
    descriptor.value = function serverWaitMethod(...args) { // eslint-disable-line
      const key = `${target.constructor.name}.${name}`;
      const promises = this.serverWait;
      if (!promises.has(key)) {
        promises.set(key, {
          promise: fromPromise(method.apply(this, args)),
          maxWait,
        });
      } else if (typeof window !== 'undefined') {
        if (promises.get(key).promise.state === 'pending') {
          method.apply(this, args);
        }
      }
      return this;
    };
  };

export function serverWait(...props) {
  if (props.length === 1) {
    return serverWaitProxy(props[0]);
  }
  return serverWaitProxy({ maxWait: -1 })(...props);
}

export function serverWaitStore(store) {
  return class ServerWaitStore extends store {
    constructor(...args) {
      super(...args);
      const state = args[0] || {};
      extendObservable(this, {
        serverWait: asMap(state.serverWait),
      });
    }
  };
}

export function serverWaitRender({
  store,
  maxWait = 1250,
  root,
  render,
  debug = true,
}) {
  const log = debug ? console.log : () => 0; // eslint-disable-line
  const time = debug ? console.time : () => 0; // eslint-disable-line
  const timeEnd = debug ? console.timeEnd : () => 0; // eslint-disable-line

  const timers = new Map();

  time('render');
  const renderOnce = _once(() => {
    timeEnd('render');
    render(ReactDOMServer.renderToString(root), stringify(toJS(store)));
  });

  const debouncedRender = _debounce(renderOnce, 50);

  const step = () => {
    debouncedRender.cancel();

    const pending = store
    .serverWait
    .entries()
    .filter(([key, { promise, maxWait }]) => { // eslint-disable-line
      const ms = (new Date()).getTime();

      if (!timers.has(key) && promise.state === 'pending') {
        const cancel = maxWait > 0 ? setTimeout(step, maxWait) : null;
        timers.set(key, { ms, cancel });
        log(`${key}:`, 'pending', `(<${maxWait}ms)`);
      }

      if (timers.has(key)) {

        const p = timers.get(key);

        const duration = (ms - p.ms);
        if (duration > maxWait && maxWait !== -1) {
          log(`${key}:`, 'cancelled');
          return false;
        }

        if (promise.state !== 'pending') {
          ReactDOMServer.renderToString(root);
          log(`${key}:`, promise.state, `(@${duration}ms)`);
          clearTimeout(p.cancel);
          timers.delete(key);
        }
      }

      return (promise.state !== 'fulfilled');
    });

    if (pending.length === 0) {
      debouncedRender();
    }
  };

  ReactDOMServer.renderToString(root);
  autorun(step);
  setTimeout(renderOnce, maxWait);
}
