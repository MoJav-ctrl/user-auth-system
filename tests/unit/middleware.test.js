const { authenticateJWT } = require('../../middleware/authentication');
const { generateToken } = require('../../config/jwt');
const User = require('../../models/userModel');
const { setupTest } = require('../setup');

describe('Authentication Middleware', () => {
    let testUser;
    let validToken;

    beforeAll(async () => {
        testUser = new User({
            email: 'test@example.com',
            password: 'validPassword123'
        });
        await testUser.save();
        validToken = generateToken(testUser);
    });

    test('should authenticate valid JWT token', async () => {
        const req = {
            headers: {
                authorization: `Bearer ${validToken}`
            }
        };
        const res = {};
        const next = jest.fn();

        await authenticateJWT(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(req.user).toEqual({
            id: testUser._id.toString(),
            email: testUser.email
        });
    });

    test('should not authenticate invalid JWT token', async () => {
        const req = {
          headers: {
            authorization: 'Bearer invalid.token.here'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
        const next = jest.fn();
    
        await authenticateJWT(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
});