// Keep a cache of System imported modules
const cache = new Map();

const getRoute = (name) => (location, cb) => {

  if (__CLIENT__) {
    if (cache.has(name)) {
      // Trigger the callback with cached module
      return cb(null, cache.get(name));
    }

    // Fetch module via System.import api.
    return System.import('routes/' + name) // eslint-disable-line
    .then(module => {
      // Add module to cache
      cache.set(name, module.default);

      // Trigger the callback with cached module
      cb(null, module.default);
    })
    .catch(err => {
      // Warn about module not able to load.
      console.error('Could not load route %s: %o', name, err);
    });
  }

  cb(null, require('routes/' + name).default); // eslint-disable-line
};

export default getRoute;
