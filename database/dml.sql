INSERT INTO users(username, first_name, last_name, email, role)
  VALUES 
    ('aiden', 'Aiden', 'Molyneaux', 'aiden@hotmail.com', 'none'),
    ('patrick', 'Patrick', 'McDonald', 'patrick@hotmail.com', 'none'),
    ('kyra', 'Kyra', 'Samson', 'kyra@gmail.com', 'none');

INSERT INTO members(user_id, gender, birth_date, weight, height)
  VALUES
    (1, 'Male', '2001-05-01', 200, 180),
    (2, 'Female', '2001-02-16', 150, 160),
    (3, 'Female', '2001-10-11', 196, 200);

UPDATE users SET role = 'member' WHERE id = 1;
UPDATE users SET role = 'member' WHERE id = 2;
UPDATE users SET role = 'member' WHERE id = 3;
UPDATE users SET role = 'trainer' WHERE id = 4;
UPDATE users SET role = 'trainer' WHERE id = 5;
UPDATE users SET role = 'admin' WHERE id = 6;

INSERT INTO trainer(user_id, availability_type)
  VALUES
    (4, 'afternoon'),
    (5, 'morning');

INSERT INTO trainer_application(user_id, resume, status, availability_type)
  VALUES
    (4, 'I would be good at it', 'awaiting', 'afternoon'),
    (5, 'I would be better at it', 'awaiting', 'morning');

INSERT INTO room DEFAULT VALUES;
INSERT INTO room DEFAULT VALUES;
INSERT INTO room DEFAULT VALUES;
INSERT INTO room DEFAULT VALUES;
INSERT INTO room DEFAULT VALUES;

INSERT INTO equipment(name, type, maintenance_status)
	VALUES
		('Treadmill', 'Cardio Machine', 'Yes'),
		('Elliptical Trainer', 'Cardio Machine', 'Yes'),
		('Stationary Bike', 'Cardio Machine', 'No'),
		('Rowing Machine', 'Cardio Machine', 'Yes'),
		('Smith Machine', 'Strength Training Equipment', 'No'),
		('Dumbbells', 'Strength Training Equipment', 'No'),
		('Barbells', 'Strength Training Equipment', 'No'),
		('Leg Press Machine', 'Strength Training Equipment', 'Yes'),
		('Cable Machine', 'Strength Training Equipment', 'No'),
		('Pull-up Bar', 'Bodyweight/Functional Training Equipment', 'Yes');

INSERT INTO fitness_goal(member_id, goal_text, status, date_created)
	VALUES
		(1, 'Reach 180lbs', false, '2024-04-01'),
		(1, 'Beat my bench-press PR (200lbs)', true, '2024-03-01'),
		(1, 'Dont poop my pants', false, '2024-04-04');

INSERT INTO exercise_routine(member_id, description)
	VALUES
		(1, 'Tuesday - 5 sets of 10 reps of dumbbells curls, 10 pushups, 20 squats'),
		(1, 'Wednesday - 30 minute treadmill cardio, 30 minutes yoga');

INSERT INTO expertise(trainer_id, expertise, description)
  VALUES
    (1, 'Worked at Anytime Fitness', 'I trained individuals there for 2 years.'),
    (2, 'University educated', 'I attended Carleton University for health.');

INSERT INTO trains(trainer_id, room_id, availability_id)
	VALUES
		(1, 1, 8),
		(2, 2, 30),
		(2, 3, 40);
	
INSERT INTO attendee(training_session_id, member_id)
	VALUES
		(1, 1),
		(2, 2),
		(3, 3);