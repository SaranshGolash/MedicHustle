const express = require("express");
const router = express.Router();

// simple API: department wait estimate + live counts
router.get("/wait/:deptId", async (req, res) => {
  const pool = req.app.locals.pool;
  const deptId = req.params.deptId;
  const q = await pool.query(
    "SELECT COUNT(*) FROM bookings WHERE department_id = $1 AND status = $2",
    [deptId, "waiting"]
  );
  const waiting = parseInt(q.rows[0].count || "0");
  const avgService = 12; // could be dynamic
  res.json({ waiting, estimated_minutes: waiting * avgService });
});

module.exports = router;
