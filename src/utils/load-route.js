// Keep a cache of System imported modules
const cache = new Map();

// Load a route by name, as in ./src/routes/${name}.
// Return the module contents.
const loadRoute = (name) => (location, cb) => {
  if (__CLIENT__) {
    // Check if route module is cached
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
      console.error('Could not load route %s: %o', name, err); // eslint-disable-line
    });
  } else { // eslint-disable-line
    // Defaulting to require the module straight. Only on server.
    cb(null, require('routes/' + name).default); // eslint-disable-line
  }
};

export default loadRoute;
