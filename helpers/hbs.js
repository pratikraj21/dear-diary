// All the express-handlebar helpers (helper functions) will go in here.
// To use the helpers, we need to register them with handlebars (inside app.js)
// Then we can use it inside any of our .hbs files directly using the property-name (i.e. without ())
const moment = require("moment");

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },

  // cuts down public stories card content to equal and manageable sized characters
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },

  // will remove any html tags from the card content on the public stories page
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },

  // create edit icons for the stories of logged in user (floating=true is for floating edit button in public stories)
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() === loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return "";
    }
  },

  // using regex to put 'selected' attribute on the <option> in edit.hbs view depending whether the story is public or private
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
};
