import { WebSocketServer } from 'ws';

import logger from './logger.js';
import server from './server.js';

const wss = new WebSocketServer({ server, path: '/ws' });
/**
 * Base wss events
 */

wss.on('connection', (ws) => {
    logger.debug('Client connected');

    ws.on('message', (message) => {
        logger.debug(`Message received: ${message.toString()}`);
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        logger.debug('Client disconnected');
    });
});

export default wss;
