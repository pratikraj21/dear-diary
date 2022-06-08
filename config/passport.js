const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User"); // to interact with the database

// we have passed 'passport' into this file from main.js. So, we can use it here
module.exports = function (passport) {
  // we define what type of passport strategy we are using for authentication
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // after successful login...
        // console.log(profile);
        const newUser = {
          // should match the User schema (values are coming from 'profile' object when we click our google account for login )
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        try {
          // we want to store this use in the database, but first check if the use exists or not
          let user = await User.findOne({ googleId: profile.id }); // in DB, find a document whose googleId === current profile.id

          if (user) {
            // call our google auth callback
            done(null, user); // null represents the value of error
          } else {
            // create newUser and call the google auth callback
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.error(error);
        }
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};
