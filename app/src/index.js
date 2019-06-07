import React from 'react';
import { render } from 'react-dom';

import { register as registerServiceWorker } from './service-worker';

import { Root } from './components/root';

const root = document.getElementById('root');
if (root === null) {
  throw new Error('no root element');
}

render(<Root />, root);

registerServiceWorker();
