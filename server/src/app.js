const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/polls'); // Redirect to the polls page after successful login
  }
);

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    res.redirect('/');
  });
});

// Home route (test)
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Polling System</h1>');
});

// Polls route (accessible after login)
app.get('/polls', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  res.send('<h1>Polls Page</h1><p>Authenticated user</p>');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
