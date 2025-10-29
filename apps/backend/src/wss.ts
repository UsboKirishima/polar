import { WebSocketServer } from 'ws';

import server from './server.js';

const wss = new WebSocketServer({ server, path: '/ws' });
/**
 * Base wss events
 */

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Message received: ${message.toString()}`);
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

export default wss;
