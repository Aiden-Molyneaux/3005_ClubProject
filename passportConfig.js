const LocalStrategy = require("passport-local");
const { usernameExists, createUser, matchPassword } = require("./helper");

module.exports = (passport) => {
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const userExists = await usernameExists(username)
 
          if (userExists) {
            return done(null, false);
          }
 
          const user = await createUser(username, password);
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
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
    )
  );
}