const LocalStrategy = require("passport-local");
const { usernameExists, createUser, matchPassword, memberExists } = require("./helper");

async function signupVerification(req, username, password, done) {
  try {
    const { first_name, last_name, email } = req.body;

    const userExists = await usernameExists(username)

    if (userExists) {
      return done(null, false);
    }

    const user = await createUser(username, password, first_name, last_name, email);
    return done(null, user);
  } catch (error) {
    done(error);
  }
}

async function loginVerification(username, password, done) {
  try {
    const user = await usernameExists(username);
    if (!user) return done(null, false);
    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) return done(null, false);
    return done(null, {id: user.id, username: user.username});
  } catch (error) {
    return done(error, false);
  }
}

module.exports = (passport) => {
  passport.use("local-signup", new LocalStrategy({ usernameField: "username", passwordField: "password", passReqToCallback: true, }, signupVerification));
  passport.use("local-login", new LocalStrategy({ usernameField: "username", passwordField: "password", }, loginVerification));
}

