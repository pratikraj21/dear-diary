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
    console.log(req);
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

// description- show single story
// route-        GET /stories/:id
// we are using our own middleware to protect the '/stories/add' route from un-logged users
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    }

    res.render("stories/show", { story });
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});

// description- show edit story page
// route-        GET /stories/edit/:id
// we are using our own middleware to protect the '/stories/edit/:id' route from un-logged users
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    // get the story whose _id prop matches the id from the queryString & use lean() to convert it to JS object to pass to our edit.hbs template
    const story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) {
      return res.render("error/404");
    }

    // also redirect the user if its not the story owner (i.e protecting edit route from non-owners)
    if (story.user != req.user._id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", { story });
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// description- Update Story
// route-        PUT /stories/:id
// we are using our own middleware to protect the '/stories/add' route from un-logged users
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.render("error/404");
    }

    // also redirect the user if its not the story owner (i.e protecting edit route from non-owners)
    if (story.user != req.user._id) {
      res.redirect("/stories");
    } else {
      // find the story with _id (in DB) === id coming in req.params.id, and update the content with req.body
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return the document after update was applied
        runValidators: true, // making sure that the mongoose fields are valid
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// description- delete a particular story
// route-        DELETE /stories/:id
// we are using our own middleware to protect the '/stories/add' route from un-logged users
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// description- all stories of a user
// route-        GET /stories/user/:userId
// we are using our own middleware to protect the '/stories/add' route from un-logged users
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    // find the public stories of the user where user key in DB has a value === req.params.userId
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    // call the index.js OF public stories, but this time pass only this 'stories' variable created above
    res.render("stories/index", { stories });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
