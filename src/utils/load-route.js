const loadRoute = (name) => (location, cb) => {
  if (__CLIENT__ && process.env.NODE_ENV === 'production') {
    return System.import('routes/' + name) // eslint-disable-line
    .then(module => {
      cb(null, module.default);
    })
    .catch(err => {
      console.log('Could not load route: %o', err);
    });
  } else {
    cb(null, require('routes/' + name).default); // eslint-disable-line
  }
};

export default loadRoute;
