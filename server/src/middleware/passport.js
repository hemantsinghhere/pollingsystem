const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  // Check if the user exists in your database
  let user = await prisma.user.findUnique({
    where: { googleId: profile.id },
  });

  if (!user) {
    // If user does not exist, create a new user
    user = await prisma.user.create({
      data: {
        username: profile.displayName,
        googleId: profile.id,
        email: profile.emails[0].value,
        role: "user", // Default role, can be updated later
      },
    });
  }

  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  done(null, user);
});
