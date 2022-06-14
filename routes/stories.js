// index.js contains standalone top-level routes, i.e the routes which aren't followed by anything else. For eg- /dashboard
const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Story = require("../models/Story");

// description- show add story page
// route-        GET /stories/add
// we are using our own middleware to protect the '/stories/add' route from un-logged users
router.get("/add", ensureAuth, (req, res) => {
  // render stories/add "view"
  res.render("stories/add");
});

// description- process add story form coming from add.hbs
// route-        POST /stories
// we are using our own middleware to protect the '/' route from logged in users
router.post("/", ensureAuth, async (req, res) => {
  //   process the Form data coming in the req.body (using body-parser)
  try {
    // form req.body doesn't contain a user to associate the story with. But user is part of the Story schema! So, set it to user-id from User schema
    req.body.user = req.user._id;
    await Story.create(req.body); // storing in DB
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    // render the error 500 view page
    res.render("error/500");
  }
});

// description- show all public stories
// route-        GET /stories
// we are using our own middleware to protect the '/stories' route from un-logged users
router.get("/", ensureAuth, async (req, res) => {
  try {
    // populate() the stories with user info. It lets you reference documents in other collections(i.e users) so that it can be referenced in the index.hbs
    // lean() converts the mongoose documents to plain JS objects for our handlebars templating engine to render properly
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", { stories });
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

module.exports = router;
