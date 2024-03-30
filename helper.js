const client = require("./db.js");
const bcrypt = require("bcryptjs");

async function usernameExists(username) {
  const data = await client.query("SELECT * FROM users WHERE username=$1", [
    username,
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

function requestMembership() {


}

async function memberExists(user_id) {
  const data = await client.query(
    "SELECT * FROM members WHERE user_id = $1;",
    [user_id]
  );

  return !(data.rowCount == 0);
}

module.exports = { usernameExists, createUser, matchPassword, memberExists };