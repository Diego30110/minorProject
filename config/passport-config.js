const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Adjust path as necessary

function initialize(passport) {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user) {
                    return done(null, false, { message: 'No user found' });
                }
                // Add your password validation logic here (e.g., using bcrypt)
                if (password !== user.password) { // Replace with a proper password check
                    return done(null, false, { message: 'Password incorrect' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}

module.exports = initialize;
