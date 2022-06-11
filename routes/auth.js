// auth.js contains routes "authentication routes" which aren't top level routes, i.e routes which are usually contains more than a single standalone keyword
const express = require("express");
const passport = require("passport");
const router = express.Router();

// description- auth with google
// route-        GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] })); // bcz 'profile' contains all the user data

// description- google auth callback
// route-       GET /auth/google/callback

// This is the callback which is called when the user clicks their google account to login & login is a success.
// If failure, reditect to root i.e login page, otherwise redirect to dashboard
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// description-  logout user
// route-        /auth/logout
router.get("/logout", (req, res) => {
  // logout() comes with passportJS & just recently it has become asynchronous (i.e it requires a callback now)
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
