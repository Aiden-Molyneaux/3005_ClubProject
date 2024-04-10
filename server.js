// will set all of our environment variables in process.env if we are not in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const client = require("./db.js");
const passport = require("passport");
const session = require('express-session');

// EXPRESS CONFIGURATION
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PASSPORT INITIALIZATION
const initializePassport = require("./passportConfig");
initializePassport(passport);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// AUTHENTICATION
app.post(
  "/auth/signup",
  passport.authenticate("local-signup"),
  (req, res, next) => {
    Logger.signupRequestReceived();
    
    res.json({ user: req.user, });
  }
);

app.post(
  "/auth/login",
  passport.authenticate("local-login"),
  (req, res, next) => {
    Logger.loginRequestReceived();

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
  Logger.patchRequestReceived();
  
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

app.put("/users/:id", putUser);
async function putUser(req, res) {
  Logger.putRequestReceived();
  
  const { username, first_name, last_name, email, role } = req.body;
  let data;
  try {

    data = await client.query(
      `UPDATE users SET username = $2, first_name = $3, last_name = $4, email = $5 WHERE id = $1 RETURNING id, username, first_name, last_name, email, role;`, 
      [req.params.id, username, first_name, last_name, email])
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Could not update User." }); }
    else { res.status(200).json({ user: data.rows[0] }); }
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

  const { user_id, gender, birth_date, weight, height } = req.body;
  let data;

  try {
    data = await client.query(
      "INSERT INTO members(user_id, gender, birth_date, weight, height) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, gender, birth_date, weight, height", 
      [user_id, gender, birth_date, weight, height]
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ member: data.rows[0]} )
  }
}

app.put("/members/:id", putMember);
async function putMember(req, res) {
  Logger.putRequestReceived();
  
  const { gender, birth_date, weight, height } = req.body;
  let data;
  try {
    data = await client.query(
      `UPDATE members SET gender = $2, birth_date = $3, weight = $4, height = $5 WHERE id = $1 RETURNING id, user_id, gender, birth_date, weight, height;`, 
      [req.params.id, gender, birth_date, weight, height])
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Could not update Member." }); }
    else { res.status(200).json({ member: data.rows[0] }); }
  }
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

// TRAINING SESSION CRUD
app.get("/training_sessions", geTrainingSessions);
async function geTrainingSessions(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query(
      `SELECT member_id, training_session_id, room_id, availability_id, date, start_time, end_time, session_trainer.trainer_id, user_id, username, first_name, last_name, email
        FROM (
            SELECT *
            FROM (
                SELECT *
                FROM trains
                JOIN attendee ON trains.id = attendee.training_session_id
            ) AS session_attendee
            JOIN trainer ON session_attendee.trainer_id = trainer.id
        ) AS session_trainer
        JOIN trainer_availability ON session_trainer.availability_id = trainer_availability.id
        JOIN users ON session_trainer.user_id = users.id;`
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ training_sessions: data.rows });
  }
}

app.post("/training_sessions", createTrainingSession);
async function createTrainingSession(req, res) {
  Logger.postRequestReceived();

  const { trainer_id, room_id, availability_id } = req.body;
  let data;

  try {
    data = await client.query(
      "INSERT INTO trains(trainer_id, room_id, availability_id) VALUES ($1, $2, $3) RETURNING id, trainer_id, room_id, availability_id", 
      [trainer_id, room_id, availability_id]
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ training_session: data.rows[0]} )
  }
}

app.delete("/training_sessions/:id", deleteTrainingSession);
async function deleteTrainingSession(req, res) {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query("DELETE FROM trains WHERE id = $1;", [req.params.id]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Training session does not exist." }); }
    else { res.status(200).json({ confirmation: "Training session deleted." }); }
  }
}

app.delete("/training_sessions_by_trainer", deleteTrainingSessionByTrainer);
async function deleteTrainingSessionByTrainer(req, res) {
  Logger.deleteRequestReceived();

  console.log(req.params);
  const trainer_id = req.query.trainer_id;
  console.log({trainer_id})
  let data;
  try {
    data = await client.query("DELETE FROM trains WHERE trainer_id = $1;", [trainer_id]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Trainer's training sessions do not exist." }); }
    else { res.status(200).json({ confirmation: "Trainer's training sessions deleted." }); }
  }
}

// ATTENDEE CRUD
app.post("/attendees", createAttendee);
async function createAttendee(req, res) {
  Logger.postRequestReceived();

  const { training_session_id, member_id } = req.body;
  console.log(training_session_id, member_id);
  let data;

  try {
    data = await client.query(
      "INSERT INTO attendee(training_session_id, member_id) VALUES ($1, $2) RETURNING training_session_id, member_id", 
      [training_session_id, member_id]
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ attendee: data.rows[0]} )
  }
}

app.delete("/attendees", deleteAttendee);
async function deleteAttendee(req, res) {
  Logger.deleteRequestReceived();

  const { training_session_id, member_id } = req.body;
  let data;
  try {
    data = await client.query("DELETE FROM attendee WHERE training_session_id = $1 AND member_id = $2;", [training_session_id,  member_id]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Attendee does not exist." }); }
    else { res.status(200).json({ confirmation: "Attendee deleted." }); }
  }
}

// FITNESS GOAL CRUD
app.get("/fitness_goals", getFitnessGoals);
async function getFitnessGoals(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM fitness_goal;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ fitness_goals: data.rows });
  }
}

app.post("/fitness_goals", createFitnessGoal);
async function createFitnessGoal(req, res) {
  Logger.postRequestReceived();

  const { member_id, goal_text, status, date_created } = req.body;
  let data;

  try {
    data = await client.query(
      "INSERT INTO fitness_goal(member_id, goal_text, status, date_created) VALUES ($1, $2, $3, $4) RETURNING id, member_id, goal_text, status, date_created", 
      [member_id, goal_text, status, date_created]
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ fitness_goal: data.rows[0]} )
  }
}

app.patch("/fitness_goals/:id", patchFitnessGoal);
async function patchFitnessGoal(req, res) {
  Logger.patchRequestReceived();

  const { status } = req.body;
  let data;
  try {
    data = await client.query(
      `UPDATE fitness_goal SET status = $2 WHERE id = $1;`, 
      [req.params.id, status]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Could not update Fitness goal." }); }
    else { res.status(200).json({confirmation: "Fitness goal updated." }); }
  }
}

app.delete("/fitness_goals/:id", deleteFitnessGoal);
async function deleteFitnessGoal(req, res) {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      "DELETE FROM fitness_goal WHERE id = $1;", 
      [req.params.id]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Fitness goal does not exist." }); }
    else { res.status(200).json({ confirmation: "Fitness goal deleted." }); }
  }
}

// EXERCISE ROUTINE CRUD
app.get("/exercise_routines", getExerciseRoutines);
async function getExerciseRoutines(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM exercise_routine;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ exercise_routines: data.rows });
  }
}

app.post("/exercise_routines", createExerciseRoutine);
async function createExerciseRoutine(req, res) {
  Logger.postRequestReceived();

  const { member_id, description } = req.body;
  let data;

  try {
    data = await client.query(
      "INSERT INTO exercise_routine(member_id, description) VALUES ($1, $2) RETURNING id, member_id, description", 
      [member_id, description]
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ exercise_routine: data.rows[0]} )
  }
}

app.delete("/exercise_routines/:id", deleteExerciseRoutine);
async function deleteExerciseRoutine(req, res) {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      "DELETE FROM exercise_routine WHERE id = $1;", 
      [req.params.id]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Exercise routine does not exist." }); }
    else { res.status(200).json({ confirmation: "Exercise routine deleted." }); }
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

app.get("/trainers_with_user", getTrainersWithUser);
async function getTrainersWithUser(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query(`SELECT trainer.id as trainer_id, first_name, last_name 
    FROM trainer, users WHERE trainer.user_id = users.id;`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainers_with_user: data.rows });
  }
}

app.post("/trainers", createTrainer);
async function createTrainer(req, res) {
  Logger.postRequestReceived();

  const { user_id, availability_type } = req.body;
  let data;

  try {
    data = await client.query(
      "INSERT INTO trainer(user_id, availability_type) VALUES ($1, $2) RETURNING id, user_id, availability_type", 
      [user_id, availability_type]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ trainer: data.rows[0]} )
  }
}

app.patch("/trainers/:id", patchTrainer);
async function patchTrainer(req, res) {
  Logger.patchRequestReceived();

  const { availability_type } = req.body;
  let data;
  try {
    data = await client.query(
      `UPDATE trainer SET availability_type = $2 WHERE id = $1 RETURNING id, user_id, availability_type;`, 
      [req.params.id, availability_type]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Could not update Trainer." }); }
    else { res.status(200).json({ trainer: data.rows[0] }); }
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

// TRAINER APPLICATION CRUD
app.get("/trainer_applications", getTrainerApplications);
async function getTrainerApplications(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM trainer_application;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainer_applications: data.rows });
  }
}

app.get("/trainer_applications_with_user", getMoreApplicationInfo);
async function getMoreApplicationInfo(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM users, trainer_application WHERE users.id = trainer_application.user_id;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainer_applications: data.rows });
  }
}

app.post("/trainer_applications", createTrainerApplication);
async function createTrainerApplication(req, res) {
  Logger.postRequestReceived();

  const { user_id, resume, status, availability_type } = req.body;
  let data;

  try {
    data = await client.query(
      "INSERT INTO trainer_application(user_id, resume, status, availability_type) VALUES ($1, $2, $3, $4) RETURNING id, user_id, resume, status, availability_type", 
      [user_id, resume, status, availability_type]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ trainer_application: data.rows[0]} )
  }
}

app.patch("/trainer_applications/:id", patchTrainerApplication);
async function patchTrainerApplication(req, res) {
  Logger.patchRequestReceived();

  const { status } = req.body;
  let data;
  try {
    data = await client.query(
      `UPDATE trainer_application SET status = $2 WHERE id = $1;`, 
      [req.params.id, status]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Could not update Trainer Application." }); }
    else { res.status(200).json({confirmation: "Trainer Application updated." }); }
  }
}

// TRAIN AVAILABILITY CRUD
app.get("/trainer_availability", getTrainerAvailability);
async function getTrainerAvailability(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM trainer_availability;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainer_availabilities: data.rows });
  }
}

app.get("/trainer_availability_with_trains", getTrainerAvailabilityWithTrains);
async function getTrainerAvailabilityWithTrains(req, res) {
  Logger.getRequestReceived();

  const trainer_id = req.query.trainer_id;
  console.log(trainer_id)
  let data;
  try {
    data = await client.query(
      `SELECT trainer_availability.id as id, trains.id as training_session_id, status, start_time, end_time, date
      FROM trainer_availability
      LEFT JOIN trains ON trainer_availability.id = trains.availability_id
      WHERE trainer_availability.trainer_id = $1;`,
      [trainer_id]
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainer_availabilities: data.rows });
  }
}


app.post("/trainer_availability", createTrainerAvailability);
async function createTrainerAvailability(req, res) {
  Logger.postRequestReceived();

  const { trainer_id, availability_type } = req.body;

  const availabilities = [];
  const currentDate = new Date();

  if (availability_type == 'morning') {
    // Generate availability entries for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      
      const commonAttrs = {trainer_id: trainer_id, status: 'available', date: date}
      availabilities.push({
        ...commonAttrs,
        start_time: '06:00:00',
        end_time: '08:00:00'
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '08:00:00',
        end_time: '10:00:00'
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '10:00:00',
        end_time: '12:00:00'
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '12:00:00',
        end_time: '14:00:00'
      });
    }
  } else if (availability_type == 'afternoon') {
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      
      const commonAttrs = {trainer_id: trainer_id, status: 'available', date: date}
      availabilities.push({
        ...commonAttrs,
        start_time: '08:00:00',
        end_time: '10:00:00'
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '10:00:00',
        end_time: '12:00:00'
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '12:00:00',
        end_time: '14:00:00'
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '14:00:00',
        end_time: '16:00:00'
      });
    }
  } else {
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      
      const commonAttrs = {trainer_id: trainer_id, status: 'available', date: date}
      availabilities.push({
        ...commonAttrs,
        start_time: '12:00:00',
        end_time: '14:00:00'
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '14:00:00',
        end_time: '16:00:00'
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '16:00:00',
        end_time: '18:00:00'
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '18:00:00',
        end_time: '20:00:00'
      });
    }
  }

  try {
    // Insert all availability entries in a single query
    await client.query(
      `INSERT INTO trainer_availability(trainer_id, status, date, start_time, end_time) 
      VALUES ${availabilities.map((_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`).join(', ')}
      RETURNING id, trainer_id, status, date, start_time, end_time`,
      availabilities.flatMap(availability => [availability.trainer_id, availability.status, availability.date, availability.start_time, availability.end_time])
    );

    res.status(200).json({ message: 'Trainer availability created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

app.patch("/trainer_availability/:id", patchTrainerAvailability);
async function patchTrainerAvailability(req, res) {
  Logger.patchRequestReceived();

  const { status } = req.body;
  let data;
  try {
    data = await client.query(
      `UPDATE trainer_availability SET status = $2 WHERE id = $1 RETURNING id, trainer_id, start_time, end_time, status, date;`, 
      [req.params.id, status]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Could not update Trainer Availability." }); }
    else { res.status(200).json({ trainer_availability: data.rows[0] }); }
  }
}


app.delete("/trainer_availability/:id", deleteAvailability);
async function deleteAvailability(req, res) {
  Logger.deleteRequestReceived();

  let data;
  console.log(req.params.id);
  try {
    data = await client.query(
      "DELETE FROM trainer_availability WHERE trainer_id = $1;", 
      [req.params.id]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Trainer availability does not exist." }); }
    else { res.status(200).json({confirmation: "Trainer availability deleted." }); }
  }
}

// EXPERTISE CRUD
app.get("/expertise", getTrainerExpertise);
async function getTrainerExpertise(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM expertise;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ expertise: data.rows });
  }
}

app.post("/expertise", createTrainerExpertise);
async function createTrainerExpertise(req, res) {
  Logger.postRequestReceived();

  const { expertise, trainer_id, description } = req.body;
  let data;

  try {
    data = await client.query(
      "INSERT INTO expertise(expertise, trainer_id, description) VALUES ($1, $2, $3) RETURNING id, expertise, trainer_id, description", 
      [expertise, trainer_id, description]
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    res.status(200).json({ expertise: data.rows[0]} )
  }
}

app.delete("/expertise/:id", deleteExpertise);
async function deleteExpertise(req, res) {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      "DELETE FROM expertise WHERE id = $1;", 
      [req.params.id]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (data.rowCount == 0) { res.status(404).json({ error: "Expertise entry does not exist." }); }
    else { res.status(200).json({ confirmation: "Expertise entry deleted." }); }
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

// ROOM CRUD
app.get("/equipment", getEquipment);
async function getEquipment(req, res) {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query("SELECT * FROM equipment;");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ equipment: data.rows });
  }
}

app.patch("/equipment/:id", patchEquipment);
async function patchEquipment(req, res) {
  Logger.postRequestReceived();

    const { maintenance_status } = req.body;
    let data;
    try {
      data = await client.query(
        `UPDATE equipment SET maintenance_status = $2 WHERE id = $1;`, 
        [req.params.id, maintenance_status]
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (data.rowCount == 0) { res.status(404).json({ error: "Could not update Equipment." }); }
      else { res.status(200).json({confirmation: "Equipment updated." }); }
    }
}

// app.post("/rooms", createRoom);
// async function createRoom(req, res) {
//   Logger.postRequestReceived();

//   const {  } = req.body;
//   let data;

//   try {
//     data = await client.query(
//       "INSERT INTO room() VALUES ($1) RETURNING id, user_id", 
//       []);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' })
//   } finally {
//     res.status(200).json({ trainer: data.rows[0]} )
//   }
// }

// logging class for debugging
class Logger {
  static getRequestReceived() { console.log('GET request received'); }
  static postRequestReceived() { console.log('POST request received'); }
  static patchRequestReceived() { console.log('PATCH request received'); }
  static putRequestReceived() { console.log('PUT request received'); }
  static deleteRequestReceived() { console.log('DELETE request received'); }
  static signupRequestReceived() { console.log('SIGNUP request received'); }
  static loginRequestReceived() { console.log('LOGIN request received'); }
  static isAuthenticatedRequestReceived() { console.log('IS AUTHENTICATED request received'); }
}

app.listen(3000, () => console.log("Listening on port 3000"));