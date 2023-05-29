import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { JobsProvider } from 'hooks';
import store from 'state/store';
import App from 'view/App';

import './index.scss';

window.DATA = window.DATA && window.DATA !== '{{data}}' ? JSON.parse(window.atob(window.DATA)) : {};

createRoot(document.getElementById('root')).render(
  <JobsProvider>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </JobsProvider>,
);
