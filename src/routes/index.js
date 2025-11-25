const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/dashboard", ensureLoggedIn, async (req, res) => {
  const pool = req.app.locals.pool;
  // fetch upcoming bookings for user
  const q = await pool.query(
    "SELECT b.*, d.name as dept_name FROM bookings b LEFT JOIN departments d ON b.department_id = d.id WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10",
    [req.user.id]
  );
  res.render("dashboard", { bookings: q.rows });
});

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "Please log in to continue");
  res.redirect("/auth/login");
}

module.exports = router;
