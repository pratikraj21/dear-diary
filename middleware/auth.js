// This piece of middleware helps us protect the routes, i.e. it helps us make sure that users can not navigate to any page they want simply by chaging the URL. For eg, (1.) we don't want them to go to /dashboard if they aren't logged in. (2.) if user is logged in, we don't want them to be able to see the login page

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // i.e. continue executing further code
    } else {
      res.redirect("/");
    }
  },

  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next(); // i.e continue executing further code
    }
  },
};
