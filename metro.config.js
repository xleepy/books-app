const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// @mswjs/interceptors subpath packages have invalid exports paths with ".."
// so Metro falls back to file-based resolution. 'browser' first picks browser
// builds (no node:zlib / async_hooks) instead of the node builds.
config.resolver.resolverMainFields = ['browser', 'react-native', 'main'];

// The WebSocket interceptor browser build extends MessageEvent/Event which
// Hermes doesn't expose as globals. We don't mock WebSockets, so stub it out.
config.resolver.resolveRequest = (context, moduleName, _platform) => {
  if (moduleName === '@mswjs/interceptors/WebSocket') {
    return {
      filePath: require.resolve('./src/mocks/stubs/websocket-interceptor.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, _platform);
};

module.exports = config;
