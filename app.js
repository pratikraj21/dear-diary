const express = require("express");
const dotenv = require("dotenv");
const { engine } = require("express-handlebars");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/db");

const app = express();

app.use(express.static("public"));

/* ***************************
------DOTENV------
**************************** */
// Load config env file which will contain all our global variables
// which can be accessed using process.env.<variable>
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 8000;

/* ***************************
------PASSPORT-CONFIG------
**************************** */
// pass the passport object which was required above so that we can use this obj in the passport.js file
require("./config/passport")(passport);

/* ***************************
------DATABASE-CONNECTION------
**************************** */
connectDB();

/* ***************************
------MORGAN-MIDDLEWARE------
**************************** */
// to run only in development mode
if (process.env.NODE_ENV === "development") {
  // middleware to "log" HTTP requests & errors in the console
  app.use(morgan("dev"));
}

/* ***************************
------HANDLEBARS-CONFIG------
**************************** */
// using express-handlebars as the view engine. Will look for views inside "views" folder by default
app.set("view engine", ".hbs");
// to use .hbs extension rather than .handlebars & setting defaultLayout to main.hbs
// which will wrap around all other .hbs files so that we don't have to repeat same code
app.engine(".hbs", engine({ defaultLayout: "main", extname: ".hbs" }));

/* ***************************
------EXPRESS-SESSION-MIDDLEWARE------
**************************** */
app.use(
  session({
    secret: "secretkeeper",
    resave: false, // means don't re-save the session if nothing modified
    saveUninitialized: false, // means don't create a session until something is stored
  })
);

/* ***************************
------PASSPORT-MIDDLEWARE------
**************************** */
app.use(passport.initialize());
app.use(passport.session()); // for it to work, we use express-session initialised above

/* ***************************
------ROUTES------
**************************** */
// top level routes handled by routes/index.js (Good way to manage multiple routes)
app.use("/", require("./routes/index"));
// authentication routes are handled by routes/auth.js
app.use("/auth", require("./routes/auth"));

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
