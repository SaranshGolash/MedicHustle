const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate"); // Import the library

const app = express();

// 1. Configure ejs-mate as the engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. Middleware to serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// 3. Middleware to prevent "user is not defined" error in Navbar
// This ensures 'user' is always available in your ejs files
app.use((req, res, next) => {
  res.locals.user = null; // Set to 'true' or an object to test the "Dashboard" view
  next();
});

// --- ROUTES ---

// Home Page
app.get("/", (req, res) => {
  res.render("index", { title: "CivicEase - Home" });
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login", { title: "Login", error: null });
});

// Signup Page
app.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up", error: null });
});

// Auth Logic (Placeholder)
app.post("/auth/login", (req, res) => {
  // Logic to check password...
  res.redirect("/dashboard");
});

app.post("/auth/signup", (req, res) => {
  // Logic to create user...
  res.redirect("/login");
});

// Dashboard (Protected Route example)
app.get("/dashboard", (req, res) => {
  // Mocking a logged-in user for this view
  res.render("index", {
    title: "Dashboard",
    user: { name: "Demo User" }, // Passing a user changes the Navbar
  });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
