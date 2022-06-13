const mongoose = require("mongoose");

// we will get these data from google login
const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // for whitespaces
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  user: {
    // special type, connecting each of the story to a specific User
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to User model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export it as a mongoose model
module.exports = mongoose.model("Story", StorySchema);
