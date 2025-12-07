import { createServer } from 'node:http';

import app from './app.js';

/**
 * By creating HTTPS Server with this method,
 * we are able to share the same HTTP server both
 * with WSS (WebSocket) and REST (Express).
 *
 * ┌──────────────────────┐                        ┌────────────────────┐
 * │     HTTP Server      ├────────────────────────┤  Express.js server │
 * └──────────┬───────────┘                        └────────────────────┘
 *            │           ┌────────────────────┐
 *            └───────────┤  WebSocket server  │
 *                        └────────────────────┘
 *
 */
const server = createServer(app);

export default server;
