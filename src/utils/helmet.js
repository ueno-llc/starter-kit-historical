/* eslint global-require: 0 */
/* eslint import/no-unresolved: 0 */

const img = require('!file-loader!assets/favicon/android-chrome-192x192.png');

export default {
  htmlAttributes: {
    lang: 'en',
  },
  title: 'Home',
  titleTemplate: 'Ueno. - %s',
  defaultTemplate: '???',
  meta: [{
    name: 'msapplication-TileColor',
    content: '#aa0078',
  }, {
    name: 'msapplication-TileImage',
    content: require('!file-loader!assets/favicon/mstile-150x150.png'),
  }, {
    name: 'theme-color',
    content: '#ffffff',
  }, {
    property: 'og:image',
    content: require('!file-loader!assets/favicon/android-chrome-192x192.png'),
  },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:image', content: img },
  { name: 'twitter:site', content: '@ueno' },
  { name: 'twitter:creator', content: '@ueno' },
  { name: 'twitter:description', content: 'Ueno. description text here!' },
  { name: 'twitter:title', content: 'Ueno.' },
  ],
  link: [{
    rel: 'manifest',
    href: require('!file-loader!assets/favicon/manifest.json'),
  }, {
    rel: 'mask-icon',
    href: require('!file-loader!assets/favicon/safari-pinned-tab.svg'),
    color: '#aa0078',
  }, {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: require('!file-loader!assets/favicon/apple-touch-icon.png'),
  }, {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: require('!file-loader!assets/favicon/favicon-16x16.png'),
  }, {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: require('!file-loader!assets/favicon/favicon-32x32.png'),
  }],
};
