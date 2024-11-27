const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes'); // Adjust the path as needed

const app = express();

// Middleware and other configurations
app.use(passport.initialize());
app.use(passport.session());

// Register authentication routes
app.use('/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));