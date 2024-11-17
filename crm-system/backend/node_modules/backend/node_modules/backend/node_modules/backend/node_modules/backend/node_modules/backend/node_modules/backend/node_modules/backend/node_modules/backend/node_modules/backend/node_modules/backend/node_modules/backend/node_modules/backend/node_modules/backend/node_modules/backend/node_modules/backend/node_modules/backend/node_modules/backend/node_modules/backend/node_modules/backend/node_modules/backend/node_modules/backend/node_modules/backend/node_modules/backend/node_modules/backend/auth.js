const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const router = express.Router();

const GOOGLE_CLIENT_ID = '476382213672-761dm66ir6ig6ul4p7bov1fb2cbterpr.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
},
  (accessToken, refreshToken, profile, done) => {
    // Save the user's profile to the session or DB
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2'],
}));

router.use(passport.initialize());
router.use(passport.session());

// Route to start the Google login process
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Callback route to handle Google's response after authentication
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard'); // Redirect to your dashboard or protected page
  }
);

module.exports = router;
