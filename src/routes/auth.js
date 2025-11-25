const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/login", (req, res) => res.render("auth/login"));

// local register/login (simple)
router.post("/register", async (req, res) => {
  const pool = req.app.locals.pool;
  const { name, email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Missing fields");
    return res.redirect("/auth/login");
  }
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rowCount) {
    req.flash("error", "Email already registered");
    return res.redirect("/auth/login");
  }
  const hash = await bcrypt.hash(password, 10);
  const id = require("uuid").v4();
  await pool.query(
    "INSERT INTO users(id,name,email,password_hash,is_admin) VALUES($1,$2,$3,$4,$5)",
    [id, name, email, hash, false]
  );
  req.flash("success", "Account created — please log in");
  res.redirect("/auth/login");
});

router.post("/local-login", async (req, res, next) => {
  const pool = req.app.locals.pool;
  const { email, password } = req.body;
  const r = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (!r.rowCount) {
    req.flash("error", "Invalid credentials");
    return res.redirect("/auth/login");
  }
  const u = r.rows[0];
  if (!u.password_hash) {
    req.flash("error", "Use OAuth login");
    return res.redirect("/auth/login");
  }
  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) {
    req.flash("error", "Invalid credentials");
    return res.redirect("/auth/login");
  }
  req.login(
    { id: u.id, name: u.name, email: u.email, is_admin: u.is_admin },
    (err) => {
      if (err) return next(err);
      res.redirect("/dashboard");
    }
  );
});

// OAuth: Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  (req, res) => res.redirect("/dashboard")
);

router.get("/logout", (req, res) => {
  req.logout(() => {});
  res.redirect("/");
});

module.exports = router;
