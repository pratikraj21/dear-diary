const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { engine } = require("express-handlebars");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

const app = express();

// body parser middleware
app.use(express.urlencoded({ extended: false }));
// not needed in our app but still good to have
app.use(express.json());

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
------HANDLEBARS-HELPERS------
**************************** */
const { formatDate } = require("./helpers/hbs");

/* ***************************
------HANDLEBARS-CONFIG------
**************************** */
// using express-handlebars as the view engine. Will look for views inside "views" folder by default
app.set("view engine", ".hbs");
// to use .hbs extension rather than .handlebars & setting defaultLayout to main.hbs
// which will wrap around all other .hbs files so that we don't have to repeat same code
app.engine(
  ".hbs",
  engine({ helpers: { formatDate }, defaultLayout: "main", extname: ".hbs" })
);

/* ***************************
------EXPRESS-SESSION-MIDDLEWARE------
**************************** */
app.use(
  session({
    secret: "secretkeeper",
    resave: false, // means don't re-save the session if nothing modified
    saveUninitialized: false, // means don't create a session until something is stored
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // storing session in DB so that server-restart doesn't log user out.
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
// stories routes are handled by routes/stories.js
app.use("/stories", require("./routes/stories"));

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
