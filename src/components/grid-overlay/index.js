import React from 'react';
import GridOverlay from './GridOverlay';

export default () => process.env.NODE_ENV !== 'production' ? <GridOverlay /> : null;
