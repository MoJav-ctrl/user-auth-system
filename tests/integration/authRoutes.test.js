const request = require('supertest');
const app = require('../../app');
const User = require('../../models/userModel');
const { setupTest } = require('../setup');

describe('Auth Routes', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'testPassword123'
    };

    beforeAll(async () => {
        await setupTest();
    });

    test('POST /api/auth/signup - should create a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(testUser);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    test('POST /api/auth/login - should log in an existing user', async () => {
        // First create the user
        await User.create(testUser);
        //     await request(app)
        //     .post('/api/auth/signup')
        //     .send(testUser);
        // Then log in with the same credentials
        const res = await request(app)
            .post('/api/auth/login')
            .send(testUser);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('POST /api/auth/reset-password - should request password reset', async () => {
        await User.create(testUser);

        const res = await request(app)
            .post('/api/auth/reset-password')
            .send({ email: testUser.email });

        expect(res.status).toBe(202);
    });

    test('PUT /api/auth/reset-password/:token - should reset password', async () => {
        const user = await User.create(testUser);
        const token = user.generatePasswordResetToken();

        const response = await request(app)
            .put(`/api/auth/reset-password/${token}`)
            .send({ password: 'newPassword123' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);

        const updatedUser = await User.findById(user._id);
        expect(updatedUser).not.toBeNull();
        expect(updatedUser.comparePassword('newPassword123')).toBe(true);
    });
});