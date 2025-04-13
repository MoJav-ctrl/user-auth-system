const request = require('supertest');
const app = require('../../app');
const User = require('../../models/userModel');
const { generateToken } = require('../../config/jwt');
const { setupTest } = require('../setup');

describe('User Routes', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    await setupTest();
    testUser = new User({
      email: 'user@example.com',
      password: 'securePass123'
    });
    await testUser.save();
    authToken = generateToken(testUser);
  });

  test('GET /api/users/profile - should return user profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  test('PUT /api/users/profile - should update user', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ email: 'newemail@example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('newemail@example.com');
  });
});