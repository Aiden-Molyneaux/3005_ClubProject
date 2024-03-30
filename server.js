const passport = require("passport");
require("./passportConfig")(passport);
const client = require("./db.js");
const express = require("express");

// EXPRESS CONFIGURATION
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AUTHENTICATION
app.post(
  "/auth/signup",
  passport.authenticate("local-signup", { session: false }),
  (req, res, next) => {
    res.json({
      user: req.user,
    });
  }
);

app.post(
  "/auth/login",
  passport.authenticate("local-login", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

// USER CRUD
app.get("/users", getUsers);
async function getUsers(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM users;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ users: data.rows });
  }
}

app.patch("/users/:id", patchUser);
async function patchUser(req, res) {
  Logger.postRequestReceived();
  
    let data;
    try {
      if (Object.keys(req.body).length == 1) {
        data = await client.query(
          `UPDATE users SET ${Object.keys(req.body)[0]} = $1 WHERE id = $2;`, 
          [Object.values(req.body)[0], req.params.id])
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (data.rowCount == 0) { res.status(404).json({ error: "Could not update User." }); }
      else { res.status(200).json({confirmation: "User updated." }); }
    }
}

app.delete("/users/:id", deleteUser);
async function deleteUser(req, res) {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      "DELETE FROM users WHERE id = $1;", 
      [req.params.id])
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "User does not exist." }); }
    else { res.status(200).json({ confirmation: "User deleted." }); }
  }
}

// MEMBER CRUD
app.get("/members", getMembers);
async function getMembers(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM members;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ members: data.rows });
  }
}

app.post("/members", createMember);
async function createMember(req, res) {
  Logger.postRequestReceived();

  const { user_id, gender, birth_date, weight } = req.body;
  let data;

  try {
    data = await client.query(
      "INSERT INTO members(user_id, gender, birth_date, weight) VALUES ($1, $2, $3, $4) RETURNING id, user_id, gender, birth_date, weight", 
      [user_id, gender, birth_date, weight]
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ member: data.rows[0]} )
  }
}

app.patch("/members/:id", patchMember);
async function patchMember(req, res) {
  Logger.patchRequestReceived();
}

app.delete("/members/:id", deleteMember);
async function deleteMember(req, res) {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      "DELETE FROM members WHERE id = $1;", 
      [req.params.id]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Member does not exist." }); }
    else { res.status(200).json({ confirmation: "Member deleted." }); }
  }
}

// TRAINER CRUD
app.get("/trainers", getTrainers);
async function getTrainers(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM trainer;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainers: data.rows });
  }
}

app.post("/trainers", createTrainer);
async function createTrainer(req, res) {
  Logger.postRequestReceived();

  const { user_id } = req.body;
  let data;

  try {
    data = await client.query(
      "INSERT INTO trainer(user_id) VALUES ($1) RETURNING id, user_id", 
      [user_id]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ trainer: data.rows[0]} )
  }
}

app.delete("/trainers/:id", deleteTrainer);
async function deleteTrainer(req, res) {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      "DELETE FROM trainer WHERE id = $1;", 
      [req.params.id])
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Trainer does not exist." }); }
    else { res.status(200).json({confirmation: "Trainer deleted." }); }
  }
}

// ROOM CRUD
app.get("/rooms", getRooms);
async function getRooms(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM room;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ rooms: data.rows });
  }
}

app.post("/rooms", createRoom);
async function createRoom(req, res) {
  Logger.postRequestReceived();

  const {  } = req.body;
  let data;

  try {
    data = await client.query(
      "INSERT INTO room() VALUES ($1) RETURNING id, user_id", 
      []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ trainer: data.rows[0]} )
  }
}

// logging class for debugging
class Logger {
  static getRequestReceived() { console.log('GET request received'); }
  static postRequestReceived() { console.log('POST request received'); }
  static patchRequestReceived() { console.log('PATCH request received'); }
  static deleteRequestReceived() { console.log('DELETE request received'); }
}

app.listen(3000, () => console.log("Listening on port 3000"));