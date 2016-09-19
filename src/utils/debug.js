const color = require('cli-color');

/**
 * Very simple debug method for node.
 * Allows formatting: %s %j %n.
 *
 * [HH:MM:SS.ms] type message
 * @return {void}
 */
module.exports = function debug(type, ...args) {
  const hr = process.hrtime();
  const date = new Date();

  let ds = ['Hour', 'Minute', 'Second']
  .map(d => date[`get${d}s`]());
  ds[2] += (hr[1] / 1000000 / 1000);
  ds = ds.map(d => d < 10 ? `0${d}` : d)
  .map(d => String(d).substr(0, 6));

  const ts = `${ds.join(':')}`;
  const prefix = `[${color.white(ts)}] ${type} `;

  if (typeof args[0] === 'string') {
    args[0] = `${prefix}${args[0]}`; // eslint-disable-line
  } else {
    args.splice(0, 1, prefix);
  }

  console.log(...args); // eslint-disable-line
};
