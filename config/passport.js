const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Local Strategy
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) =>
        {
            try{
                // Find the user associated with the email provided by the user
                const user = await userModel.findOne({ email });

                // If the user isn't found in the database, return a message
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                // Validate that password matches the corresponding hash stored in the database
                const validate = await bcrypt.compare(password, user.password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                } else {
                    return done(null, user, { message: 'Logged in Successfully' });
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

// JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
    secretOrKey: process.env.JWT_SECRET, // Use the JWT secret from .env file
};

passport.use(
    'jwt',
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            // Find the user associated with the JWT payload
            const user = await userModel.findById(jwt_payload.id);
            if (user) {
                // If the user is found, return null and the user
                return done(null, user);
            }
            else {
                // If the user isn't found, return false
                return done(null, false);
            }
        } catch (error) {
            done(error);
        }
    })
);

module.exports = passport;
