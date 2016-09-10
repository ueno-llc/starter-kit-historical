/* eslint global-require: 0 */
/* eslint import/no-unresolved: 0 */

export default {
  htmlAttributes: {
    lang: 'en',
  },
  title: 'Home',
  titleTemplate: 'Ueno - %s',
  defaultTemplate: '???',
  meta: [{
    name: 'msapplication-TileColor',
    content: '#aa0078',
  }, {
    name: 'msapplication-TileImage',
    content: require('!file!assets/favicon/mstile-150x150.png'),
  }, {
    name: 'theme-color',
    content: '#ffffff',
  }, {
    property: 'og:image',
    content: require('!file!assets/favicon/android-chrome-192x192.png'),
  },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:image', content: require('!file!assets/favicon/android-chrome-192x192.png') },
  { name: 'twitter:site', content: '@ueno' },
  { name: 'twitter:creator', content: '@ueno' },
  { name: 'twitter:description', content: 'Ueno description text here!' },
  { name: 'twitter:title', content: 'Ueno' },
  ],
  link: [{
    rel: 'manifest',
    href: require('!file!assets/favicon/manifest.json'),
  }, {
    rel: 'mask-icon',
    href: require('!file!assets/favicon/safari-pinned-tab.svg'),
    color: '#aa0078',
  }, {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: require('!file!assets/favicon/apple-touch-icon.png'),
  }, {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: require('!file!assets/favicon/favicon-16x16.png'),
  }, {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: require('!file!assets/favicon/favicon-32x32.png'),
  }],
};
