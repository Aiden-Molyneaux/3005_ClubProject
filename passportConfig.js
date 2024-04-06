const client = require("./db.js");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local");

async function getUserByUsername(username) {
  const data = await client.query("SELECT * FROM users WHERE username=$1", [
    username,
  ]);
 
  if (data.rowCount == 0) return false; 
  return data.rows[0];
};

async function getUserById(id) {
  const data = await client.query("SELECT * FROM users WHERE id=$1", [
    id,
  ]);
 
  if (data.rowCount == 0) return false; 
  return data.rows[0];
};

async function createUser(username, password, first_name, last_name, email) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
 
  const data = await client.query(
    "INSERT INTO users(username, password, first_name, last_name, email, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, password, first_name, last_name, email, role",
    [username, hash, first_name, last_name, email, "none"]
  );
 
  if (data.rowCount == 0) return false;
  return data.rows[0];
};

async function matchPassword(password, hashPassword) {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};

function initialize(passport) {
  async function loginVerification(username, password, done) {
    try {
      const user = await getUserByUsername(username);
      if (!user) { return done(null, false, { message: 'No user with that username.' }); }
  
      const isMatch = await matchPassword(password, user.password);
      if (!isMatch) { return done(null, false, { message: 'Password incorrect. '}); }
  
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }

  async function signupVerification(req, username, password, done) {
    try {
      const { first_name, last_name, email } = req.body;
  
      const userExists = await getUserByUsername(username)
      if (userExists) { return done(null, false); }
  
      const user = await createUser(username, password, first_name, last_name, email);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }

  passport.use("local-signup", new LocalStrategy({ usernameField: "username", passwordField: "password", passReqToCallback: true, }, signupVerification));
  passport.use("local-login", new LocalStrategy({ usernameField: "username", passwordField: "password", }, loginVerification));
  passport.serializeUser((user, done) => { 
    done(null, user.id); 
  });
  passport.deserializeUser(async (id, done) => { 
    try {
      const user = await getUserById(id);
      return done(null, user); 
    } catch {
      done(err)
    }
  });
}

module.exports = initialize;