const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = (passport, pool) => {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const r = await pool.query(
        "SELECT id, name, email, is_admin FROM users WHERE id = $1",
        [id]
      );
      done(null, r.rows[0]);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const name = profile.displayName || profile.name.givenName;
          const res = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
          ]);
          if (res.rowCount) return done(null, res.rows[0]);

          const id = uuidv4();
          const insert = await pool.query(
            "INSERT INTO users(id, name, email, password_hash, is_admin) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, is_admin",
            [id, name, email, null, false]
          );
          return done(null, insert.rows[0]);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
};
