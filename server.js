const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const path = require("path");
const helmet = require("helmet");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();
app.use(helmet());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// DB pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
app.locals.pool = pool; // make available to routes

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);
app.use(flash());

// Passport setup
require("./src/auth/passport")(passport, pool);
app.use(passport.initialize());
app.use(passport.session());

// Expose flash & user
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// Routes
app.use("/", require("./src/routes/index"));
app.use("/auth", require("./src/routes/auth"));
app.use("/booking", require("./src/routes/booking"));
app.use("/api", require("./src/routes/api"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
