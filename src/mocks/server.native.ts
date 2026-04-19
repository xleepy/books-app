// Metro picks this file for React Native builds instead of server.ts.
// Polyfills are loaded by enableMocking() before this module is imported.
import { setupServer } from 'msw/native';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
