/* eslint global-require: 0 */
if (process.env.NODE_ENV !== 'production') {
  module.exports = require('mobx-react-devtools').default;
}
