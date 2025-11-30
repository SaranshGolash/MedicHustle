const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const existing = await req.db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (existing.rows.length) {
      return res.render("signup", { error: "Account already exists." });
    }
    const result = await req.db.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id,name,email",
      [name, email, hashed]
    );
    req.session.user = result.rows[0];
    res.redirect("/dashboard");
  } catch (e) {
    console.error(e);
    res.render("signup", { error: "Something went wrong." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await req.db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (!result.rows.length) {
      return res.render("login", { error: "Invalid credentials." });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.render("login", { error: "Invalid credentials." });
    }
    req.session.user = { id: user.id, name: user.name, email: user.email };
    res.redirect("/dashboard");
  } catch (e) {
    console.error(e);
    res.render("login", { error: "Something went wrong." });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
