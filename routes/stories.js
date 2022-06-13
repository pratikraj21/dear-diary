// index.js contains standalone top-level routes, i.e the routes which aren't followed by anything else. For eg- /dashboard
const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Story = require("../models/Story");

// description- show add story page
// route-        GET /stories/add
// we are using our own middleware to protect the '/' route from logged in users
router.get("/add", ensureAuth, (req, res) => {
  // render stories/add "view"
  res.render("stories/add");
});

module.exports = router;
