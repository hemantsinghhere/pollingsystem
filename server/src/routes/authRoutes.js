const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/polls'); // Redirect to polls page after successful login
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.redirect('/');
  });
});

// Fetch User Profile
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json(req.user); // `req.user` is populated by Passport.js
});

module.exports = router;
