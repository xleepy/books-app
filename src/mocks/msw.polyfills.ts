import 'fast-text-encoding';
import 'react-native-url-polyfill/auto';

// Hermes doesn't expose MessageEvent or Event as globals.
if (typeof MessageEvent === 'undefined') {
  (globalThis as any).MessageEvent = class MessageEvent {
    readonly type: string;
    readonly data: unknown;
    readonly origin: string;
    readonly lastEventId: string;
    constructor(type: string, init: MessageEventInit = {}) {
      this.type = type;
      this.data = init.data ?? null;
      this.origin = init.origin ?? '';
      this.lastEventId = init.lastEventId ?? '';
    }
  };
}

// msw/core/ws.js creates a BroadcastChannel at module-evaluation time.
// Hermes doesn't have BroadcastChannel; a no-op stub is enough since
// we don't mock WebSockets.
if (typeof BroadcastChannel === 'undefined') {
  (globalThis as any).BroadcastChannel = class BroadcastChannel {
    readonly name: string;
    onmessage: ((ev: any) => void) | null = null;
    constructor(name: string) { this.name = name; }
    postMessage(_data: unknown) {}
    close() {}
    addEventListener(_type: string, _listener: any) {}
    removeEventListener(_type: string, _listener: any) {}
  };
}
