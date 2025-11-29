// app.js
const express = require("express");
const path = require("path");
const session = require("express-session");
const pg = require("pg");
require("dotenv").config();

const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");

const app = express();

// PostgreSQL pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// make pool available in routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.use("/", mainRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
