const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google'); 
}
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.emails[0].value, name: req.user.displayName },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );
    res.redirect(`http://localhost:3000/?token=${token}`);
  }
);

// Protected Route (Dashboard)
router.get('/', isAuthenticated, (req, res) => {
  res.json({ message: 'Welcome to your dashboard', user: req.user });
});

// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err });
    }
    res.redirect('/'); 
  });
});

module.exports = router;
