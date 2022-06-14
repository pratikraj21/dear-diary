// All the express-handlebar helpers (helper functions) will go in here.
// To use the helpers, we need to register them with handlebars (inside app.js)
// Then we can use it inside any of our .hbs files directly using the property-name (without ())
const moment = require("moment");

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
};
