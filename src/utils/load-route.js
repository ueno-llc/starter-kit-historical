const loadRoute = pkg => (location, cb) => {
  if (__CLIENT__) {
    return pkg(module => cb(null, module.default));
  }
  return cb(null, pkg);
};

export default loadRoute;
