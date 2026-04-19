// No-op stub — replaces @mswjs/interceptors/WebSocket for React Native builds.
// The WebSocket interceptor browser build uses MessageEvent/Event globals that
// Hermes doesn't expose. We don't mock WebSockets, so a stub is sufficient.
class NoopClass {}

exports.WebSocketInterceptor = NoopClass;
exports.WebSocketClientConnection = NoopClass;
exports.WebSocketClientConnectionProtocol = NoopClass;
exports.WebSocketServerConnection = NoopClass;
exports.WebSocketServerConnectionProtocol = NoopClass;
exports.CancelableMessageEvent = NoopClass;
exports.CancelableCloseEvent = NoopClass;
exports.CloseEvent = NoopClass;
