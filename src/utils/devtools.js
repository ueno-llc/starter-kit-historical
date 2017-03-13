import React from 'react';

/* eslint global-require: 0 */
if (process.env.NODE_ENV !== 'production') {

  // You are free to add any dev tools needed here.
  // They are required on runtime, so deps can be added in devDeps as needed.
  const DevTools = require('mobx-react-devtools').default;
  const GridOverlay = require('components/grid-overlay').default;

  module.exports = () => (
    <div>
      <DevTools />
      <GridOverlay columns={12} baseline={16} />
    </div>
  );
}
