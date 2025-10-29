import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';

describe('POST /api/v1/auth/register', () => {
    it('register a user, and returns accessToken and refreshToken', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .set('Accept', 'application/json')
            .send({
                email: 'test@example.com',
                password: 'StrongPassword123',
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(typeof response.body.accessToken).toBe('string');

        expect(response.body).toHaveProperty('refreshToken');
        expect(typeof response.body.refreshToken).toBe('string');
    });
});

describe('POST /api/v1/auth/login', () => {
    it('login as user by passing email and password', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .send({
                email: 'test@example.com',
                password: 'StrongPassword123',
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(typeof response.body.accessToken).toBe('string');

        expect(response.body).toHaveProperty('refreshToken');
        expect(typeof response.body.refreshToken).toBe('string');
    });
});
