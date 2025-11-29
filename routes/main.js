// routes/main.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { user: req.session.user });
});

router.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("dashboard", { user: req.session.user });
});

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

module.exports = router;
