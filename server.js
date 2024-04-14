// will set all of our environment variables in process.env if we are not in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const client = require('./db');
const Logger = require('./Logger');

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
const initializePassport = require('./passportConfig');

initializePassport(passport);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

// AUTHENTICATION
app.post(
  '/auth/signup',
  passport.authenticate('local-signup'),
  (req, res) => {
    Logger.signupRequestReceived();

    res.json({ user: req.user });
  },
);

app.post(
  '/auth/login',
  passport.authenticate('local-login'),
  (req, res) => {
    Logger.loginRequestReceived();

    res.json({ user: req.user });
  },
);

// USER CRUD
app.get('/users', async (req, res) => {
  Logger.getRequestReceived();

  let data_d;
  try {
    data = await client.query('SELECT * FROM users;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ users: data.rows });
  }
});

app.patch('/users/:id', async (req, res) => {
  Logger.patchRequestReceived();

  let data;
  try {
    if (Object.keys(req.body).length === 1) {
      data = await client.query(
        `UPDATE users SET ${Object.keys(req.body)[0]} = $1 WHERE id = $2;`,
        [Object.values(req.body)[0], req.params.id],
      );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Could not update User.' });
    } else {
      res.status(200).json({ confirmation: 'User updated.' });
    }
  }
});

app.put('/users/:id', async (req, res) => {
  Logger.putRequestReceived();

  const {
    username, firstName, lastName, email,
  } = req.body;
  let data;
  try {
    data = await client.query(
      'UPDATE users SET username = $2, first_name = $3, last_name = $4, email = $5 WHERE id = $1 RETURNING id, username, first_name, last_name, email, role;',
      [req.params.id, username, firstName, lastName, email],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) { res.status(404).json({ error: 'Could not update User.' }); } else { res.status(200).json({ user: data.rows[0] }); }
  }
});

app.delete('/users/:id', async (req, res) => {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      'DELETE FROM users WHERE id = $1;',
      [req.params.id],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'User does not exist.' });
    } else {
      res.status(200).json({ confirmation: 'User deleted.' });
    }
  }
});

// MEMBER CRUD
app.get('/members', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query('SELECT * FROM members;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ members: data.rows });
  }
});

app.post('/members', async (req, res) => {
  Logger.postRequestReceived();

  const {
    userId, gender, birthDate, weight, height,
  } = req.body;
  let data;

  try {
    data = await client.query(
      'INSERT INTO members(user_id, gender, birth_date, weight, height) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, gender, birth_date, weight, height',
      [userId, gender, birthDate, weight, height],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ member: data.rows[0] });
  }
});

app.put('/members/:id', async (req, res) => {
  Logger.putRequestReceived();

  const { gender, birthDate, weight, height } = req.body;
  let data;
  try {
    data = await client.query(
      'UPDATE members SET gender = $2, birth_date = $3, weight = $4, height = $5 WHERE id = $1 RETURNING id, user_id, gender, birth_date, weight, height;',
      [req.params.id, gender, birthDate, weight, height],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Could not update Member.' });
    } else {
      res.status(200).json({ member: data.rows[0] });
    }
  }
});

app.delete('/members/:id', async (req, res) => {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      'DELETE FROM members WHERE id = $1;',
      [req.params.id],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Member does not exist.' });
    } else {
      res.status(200).json({ confirmation: 'Member deleted.' });
    }
  }
});

// TRAINING SESSION CRUD
app.get('/training_sessions', async (req, res) => {
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
        JOIN users ON session_trainer.user_id = users.id;`,
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainingSessions: data.rows });
  }
});

app.post('/training_sessions', async (req, res) => {
  Logger.postRequestReceived();

  const { trainerId, roomId, availabilityId } = req.body;
  let data;

  try {
    data = await client.query(
      'INSERT INTO trains(trainer_id, room_id, availability_id) VALUES ($1, $2, $3) RETURNING id, trainer_id, room_id, availability_id',
      [trainerId, roomId, availabilityId],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainingSession: data.rows[0] });
  }
});

app.delete('/training_sessions/:id', async (req, res) => {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query('DELETE FROM trains WHERE id = $1;', [req.params.id]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Training session does not exist.' });
    } else {
      res.status(200).json({ confirmation: 'Training session deleted.' });
    }
  }
});

app.delete('/training_sessions_by_trainer', async (req, res) => {
  Logger.deleteRequestReceived();

  const { trainerId } = req.query;
  let data;
  try {
    data = await client.query('DELETE FROM trains WHERE trainer_id = $1;', [trainerId]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Trainer\'s training sessions do not exist.' });
    } else {
      res.status(200).json({ confirmation: 'Trainer\'s training sessions deleted.' });
    }
  }
});

// ATTENDEE CRUD
app.post('/attendees', async (req, res) => {
  Logger.postRequestReceived();

  const { trainingSessionId, memberId } = req.body;
  let data;
  try {
    data = await client.query(
      'INSERT INTO attendee(training_session_id, member_id) VALUES ($1, $2) RETURNING training_session_id, member_id',
      [trainingSessionId, memberId],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ attendee: data.rows[0] });
  }
});

app.delete('/attendees', async (req, res) => {
  Logger.deleteRequestReceived();

  const { trainingSessionId, memberId } = req.body;
  let data;
  try {
    data = await client.query('DELETE FROM attendee WHERE training_session_id = $1 AND member_id = $2;', [trainingSessionId, memberId]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Attendee does not exist.' });
    } else {
      res.status(200).json({ confirmation: 'Attendee deleted.' });
    }
  }
});

// FITNESS GOAL CRUD
app.get('/fitness_goals', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query('SELECT * FROM fitness_goal;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ fitnessGoals: data.rows });
  }
});

app.post('/fitness_goals', async (req, res) => {
  Logger.postRequestReceived();

  const {
    memberId, goalText, status, dateCreated,
  } = req.body;
  let data;

  try {
    data = await client.query(
      'INSERT INTO fitness_goal(member_id, goal_text, status, date_created) VALUES ($1, $2, $3, $4) RETURNING id, member_id, goal_text, status, date_created',
      [memberId, goalText, status, dateCreated],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ fitnessGoal: data.rows[0] });
  }
});

app.patch('/fitness_goals/:id', async (req, res) => {
  Logger.patchRequestReceived();

  const { status } = req.body;
  let data;
  try {
    data = await client.query(
      'UPDATE fitness_goal SET status = $2 WHERE id = $1;',
      [req.params.id, status],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Could not update Fitness goal.' });
    } else {
      res.status(200).json({ confirmation: 'Fitness goal updated.' });
    }
  }
});

app.delete('/fitness_goals/:id', async (req, res) => {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      'DELETE FROM fitness_goal WHERE id = $1;',
      [req.params.id],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Fitness goal does not exist.' });
    } else {
      res.status(200).json({ confirmation: 'Fitness goal deleted.' });
    }
  }
});

// EXERCISE ROUTINE CRUD
app.get('/exercise_routines', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query('SELECT * FROM exercise_routine;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ exercise_routines: data.rows });
  }
});

app.post('/exercise_routines', async (req, res) => {
  Logger.postRequestReceived();

  const { memberId, description } = req.body;
  let data;

  try {
    data = await client.query(
      'INSERT INTO exercise_routine(member_id, description) VALUES ($1, $2) RETURNING id, member_id, description',
      [memberId, description],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ exerciseRoutine: data.rows[0] });
  }
});

app.delete('/exercise_routines/:id', async (req, res) => {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      'DELETE FROM exercise_routine WHERE id = $1;',
      [req.params.id],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Exercise routine does not exist.' });
    } else {
      res.status(200).json({ confirmation: 'Exercise routine deleted.' });
    }
  }
});

// TRAINER CRUD
app.get('/trainers', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query('SELECT * FROM trainer;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainers: data.rows });
  }
});

app.get('/trainers_with_user', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query(`SELECT trainer.id as trainer_id, first_name, last_name 
    FROM trainer, users WHERE trainer.user_id = users.id;`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainersWithUser: data.rows });
  }
});

app.post('/trainers', async (req, res) => {
  Logger.postRequestReceived();

  const { userId, availabilityType } = req.body;
  let data;

  try {
    data = await client.query(
      'INSERT INTO trainer(user_id, availability_type) VALUES ($1, $2) RETURNING id, user_id, availability_type',
      [userId, availabilityType],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainer: data.rows[0] });
  }
});

app.patch('/trainers/:id', async (req, res) => {
  Logger.patchRequestReceived();

  const { availabilityType } = req.body;
  let data;
  try {
    data = await client.query(
      'UPDATE trainer SET availability_type = $2 WHERE id = $1 RETURNING id, user_id, availability_type;',
      [req.params.id, availabilityType],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Could not update Trainer.' });
    } else {
      res.status(200).json({ trainer: data.rows[0] });
    }
  }
});

app.delete('/trainers/:id', async (req, res) => {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      'DELETE FROM trainer WHERE id = $1;',
      [req.params.id],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Trainer does not exist.' });
    } else {
      res.status(200).json({ confirmation: 'Trainer deleted.' });
    }
  }
});

// TRAINER APPLICATION CRUD
app.get('/trainer_applications', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query('SELECT * FROM trainer_application;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainerApplications: data.rows });
  }
});

app.get('/trainer_applications_with_user', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query('SELECT * FROM users, trainer_application WHERE users.id = trainer_application.user_id;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainerApplications: data.rows });
  }
});

app.post('/trainer_applications', async (req, res) => {
  Logger.postRequestReceived();

  const { userId, resume, status, availabilityType } = req.body;
  let data;

  try {
    data = await client.query(
      'INSERT INTO trainer_application(user_id, resume, status, availability_type) VALUES ($1, $2, $3, $4) RETURNING id, user_id, resume, status, availability_type',
      [userId, resume, status, availabilityType],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainerApplication: data.rows[0] });
  }
});

app.patch('/trainer_applications/:id', async (req, res) => {
  Logger.patchRequestReceived();

  const { status } = req.body;
  let data;
  try {
    data = await client.query(
      'UPDATE trainer_application SET status = $2 WHERE id = $1;',
      [req.params.id, status],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Could not update Trainer Application.' });
    } else {
      res.status(200).json({ confirmation: 'Trainer Application updated.' });
    }
  }
});

// TRAIN AVAILABILITY CRUD
app.get('/trainer_availability', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query('SELECT * FROM trainer_availability;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainerAvailabilities: data.rows });
  }
});

app.get('/trainer_availability_with_trains', async (req, res) => {
  Logger.getRequestReceived();

  const { trainerId } = req.query;
  let data;
  try {
    data = await client.query(
      `SELECT trainer_availability.id as id, trains.id as training_session_id, status, start_time, end_time, date
      FROM trainer_availability
      LEFT JOIN trains ON trainer_availability.id = trains.availability_id
      WHERE trainer_availability.trainer_id = $1;`,
      [trainerId],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainerAvailabilities: data.rows });
  }
});

app.post('/trainer_availability', async (req, res) => {
  Logger.postRequestReceived();

  const { trainerId, availabilityType } = req.body;

  const availabilities = [];
  const currentDate = new Date();

  if (availabilityType === 'morning') {
    // Generate availability entries for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);

      const commonAttrs = { trainer_id: trainerId, status: 'available', date };
      availabilities.push({
        ...commonAttrs,
        start_time: '06:00:00',
        end_time: '08:00:00',
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '08:00:00',
        end_time: '10:00:00',
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '10:00:00',
        end_time: '12:00:00',
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '12:00:00',
        end_time: '14:00:00',
      });
    }
  } else if (availabilityType === 'afternoon') {
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);

      const commonAttrs = { trainer_id: trainerId, status: 'available', date };
      availabilities.push({
        ...commonAttrs,
        start_time: '08:00:00',
        end_time: '10:00:00',
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '10:00:00',
        end_time: '12:00:00',
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '12:00:00',
        end_time: '14:00:00',
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '14:00:00',
        end_time: '16:00:00',
      });
    }
  } else {
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);

      const commonAttrs = { trainer_id: trainerId, status: 'available', date };
      availabilities.push({
        ...commonAttrs,
        start_time: '12:00:00',
        end_time: '14:00:00',
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '14:00:00',
        end_time: '16:00:00',
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '16:00:00',
        end_time: '18:00:00',
      });
      availabilities.push({
        ...commonAttrs,
        start_time: '18:00:00',
        end_time: '20:00:00',
      });
    }
  }

  try {
    // Insert all availability entries in a single query
    await client.query(
      `INSERT INTO trainer_availability(trainer_id, status, date, start_time, end_time) 
      VALUES ${availabilities.map((_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`).join(', ')}
      RETURNING id, trainer_id, status, date, start_time, end_time`,
      availabilities.flatMap((availability) => [
        availability.trainer_id,
        availability.status,
        availability.date,
        availability.start_time,
        availability.end_time,
      ]),
    );

    res.status(200).json({ message: 'Trainer availability created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/trainer_availability/:id', async (req, res) => {
  Logger.patchRequestReceived();

  const { status } = req.body;
  let data;
  try {
    data = await client.query(
      'UPDATE trainer_availability SET status = $2 WHERE id = $1 RETURNING id, trainer_id, start_time, end_time, status, date;',
      [req.params.id, status],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Could not update Trainer Availability.' });
    } else {
      res.status(200).json({ trainerAvailability: data.rows[0] });
    }
  }
});

app.delete('/trainer_availability/:id', async (req, res) => {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      'DELETE FROM trainer_availability WHERE trainer_id = $1;',
      [req.params.id],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Trainer availability does not exist.' });
    } else {
      res.status(200).json({ confirmation: 'Trainer availability deleted.' });
    }
  }
});

// EXPERTISE CRUD
app.get('/expertise', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query('SELECT * FROM expertise;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ expertise: data.rows });
  }
});

app.post('/expertise', async (req, res) => {
  Logger.postRequestReceived();

  const { expertise, trainerId, description } = req.body;
  let data;

  try {
    data = await client.query(
      'INSERT INTO expertise(expertise, trainer_id, description) VALUES ($1, $2, $3) RETURNING id, expertise, trainer_id, description',
      [expertise, trainerId, description],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ expertise: data.rows[0] });
  }
});

app.delete('/expertise/:id', async (req, res) => {
  Logger.deleteRequestReceived();

  let data;
  try {
    data = await client.query(
      'DELETE FROM expertise WHERE id = $1;',
      [req.params.id],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Expertise entry does not exist.' });
    } else {
      res.status(200).json({ confirmation: 'Expertise entry deleted.' });
    }
  }
});

// ROOM CRUD
app.get('/rooms', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query('SELECT * FROM room;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ rooms: data.rows });
  }
});

app.post('/rooms', async (req, res) => {
  Logger.postRequestReceived();

  let data;
  try {
    data = await client.query(
      'INSERT INTO room() VALUES ($1) RETURNING id, user_id',
      [],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ trainer: data.rows[0] });
  }
});

// EQUIPMENT CRUD
app.get('/equipment', async (req, res) => {
  Logger.getRequestReceived();

  let data;
  try {
    data = await client.query('SELECT * FROM equipment;');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.status(200).json({ equipment: data.rows });
  }
});

app.patch('/equipment/:id', async (req, res) => {
  Logger.postRequestReceived();

  const { maintenanceStatus } = req.body;
  let data;
  try {
    data = await client.query(
      'UPDATE equipment SET maintenance_status = $2 WHERE id = $1;',
      [req.params.id, maintenanceStatus],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (data.rowCount === 0) {
      res.status(404).json({ error: 'Could not update Equipment.' });
    } else {
      res.status(200).json({ confirmation: 'Equipment updated.' });
    }
  }
});

app.listen(3000, () => console.log('Listening on port 3000'));
