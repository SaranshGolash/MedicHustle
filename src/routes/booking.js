const express = require("express");
const router = express.Router();

// show booking page
router.get("/new", ensureLoggedIn, async (req, res) => {
  const pool = req.app.locals.pool;
  const q = await pool.query("SELECT id, name FROM departments ORDER BY name");
  res.render("booking/new", { departments: q.rows });
});

// create booking
router.post("/create", ensureLoggedIn, async (req, res) => {
  const pool = req.app.locals.pool;
  const { department_id, preferred_time } = req.body;
  // generate token, compute estimated wait using a naive predictor
  const token = Math.floor(1000 + Math.random() * 9000).toString();
  const created = await pool.query(
    "INSERT INTO bookings(id,user_id,department_id,token,preferred_time,status,created_at) VALUES($1,$2,$3,$4,$5,$6,NOW()) RETURNING *",
    [
      require("uuid").v4(),
      req.user.id,
      department_id,
      token,
      preferred_time || null,
      "waiting",
    ]
  );
  req.flash("success", "Booking created — your token: " + token);
  res.redirect("/dashboard");
});

// user views queue position
router.get("/my/:id", ensureLoggedIn, async (req, res) => {
  const pool = req.app.locals.pool;
  const id = req.params.id;
  const r = await pool.query(
    "SELECT b.*, d.name as dept_name FROM bookings b JOIN departments d ON b.department_id = d.id WHERE b.id = $1 AND b.user_id = $2",
    [id, req.user.id]
  );
  if (!r.rowCount) return res.status(404).send("Not found");
  // compute simple estimated wait
  const wait = await computeEstimatedWait(pool, r.rows[0].department_id);
  res.render("booking/view", { booking: r.rows[0], estimated_wait: wait });
});

async function computeEstimatedWait(pool, department_id) {
  // naive predictor: average service time * number of waiting people ahead
  const avg = 12; // minutes average service time (replace with historical calc)
  const q = await pool.query(
    "SELECT COUNT(*) FROM bookings WHERE department_id = $1 AND status = $2",
    [department_id, "waiting"]
  );
  const count = parseInt(q.rows[0].count || "0");
  return avg * count; // minutes
}

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "Please log in");
  res.redirect("/auth/login");
}

module.exports = router;
