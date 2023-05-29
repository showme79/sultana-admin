const { createProxyMiddleware } = require('http-proxy-middleware');

const CURRENT_PROXY = process.env.PROXY_MODE || 'development';

const URI_WEBSOCKET = '/api/ws';
const URI_API = '/api';

const proxyConfigs = {
  development: {
    [URI_WEBSOCKET]: {
      target: 'ws://localhost:8080',
      ws: true,
    },
    [URI_API]: {
      target: 'http://localhost:8080',
      secure: false,
    },
  },
  docker: {
    [URI_WEBSOCKET]: {
      target: 'ws://sultana-api:8080',
      ws: true,
    },
    [URI_API]: {
      target: 'http://sultana-api:8080',
      secure: false,
    },
  },
  testing: {
    [URI_WEBSOCKET]: {
      target: 'ws://localhost:8080',
      ws: true,
    },
    [URI_API]: {
      target: 'http://localhost:8080',
      secure: false,
    },
  },
};

// eslint-disable-next-line func-names
module.exports = function (app) {
  // eslint-disable-next-line no-console
  console.log(`Proxy mode is '${CURRENT_PROXY}'`);
  const proxyConfig = proxyConfigs[CURRENT_PROXY];
  Object.keys(proxyConfig).forEach((uri) => {
    const config = proxyConfig[uri];
    app.use(createProxyMiddleware(uri, config));
  });
};
