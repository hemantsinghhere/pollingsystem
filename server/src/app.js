const express = require('express');
const session = require('express-session');
const passport = require('passport'); // Load Passport.js
require('./middleware/passport'); 
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');
const voteRoutes = require('./routes/voteRoutes');


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false, // Prevent unnecessary session saving
    saveUninitialized: false, // Do not save empty sessions
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60, // 1 hour session duration
    },
  })
);



app.use(passport.initialize());
app.use(passport.session());

// Register Routes
app.use('/auth', authRoutes);
app.use('/polls', pollRoutes);
app.use('/votes', voteRoutes);

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
