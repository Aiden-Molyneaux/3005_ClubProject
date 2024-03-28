const client = require("./db.js");
const bcrypt = require("bcryptjs");

const usernameExists = async (username) => {
  const data = await client.query("SELECT * FROM users WHERE username=$1", [
    username,
  ]);
 
  if (data.rowCount == 0) return false; 
  return data.rows[0];
};

const createUser = async (username, password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
 
  const data = await client.query(
    "INSERT INTO users(username, password) VALUES ($1, $2) RETURNING id, username, password",
    [username, hash]
  );
 
  if (data.rowCount == 0) return false;
  return data.rows[0];
};

const matchPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};

module.exports = { usernameExists, createUser, matchPassword };