CREATE TABLE users (
	id 			SERIAL PRIMARY KEY,
	username 	VARCHAR(20) UNIQUE NOT NULL,
	password 	VARCHAR(60) UNIQUE NOT NULL,
	first_name 	VARCHAR(20) NOT NULL,
	last_name 	VARCHAR(20) NOT NULL,
	email 		VARCHAR(30) UNIQUE NOT NULL,
	role		VARCHAR(30) NOT NULL
);

CREATE TABLE members (
	id			SERIAL PRIMARY KEY,
	user_id		INT UNIQUE,
	gender		VARCHAR(10),
	birth_date 	DATE,
	weight		NUMERIC(4, 1),
	height NUMERIC(3),
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE fitness_goal (
	id				SERIAL PRIMARY KEY,
	member_id		INT,
	goal_text		TEXT NOT NULL,
	status			BOOL NOT NULL,
	date_created	TIMESTAMP NOT NULL,
	FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);

CREATE TABLE exercise_routine (
	id			SERIAL PRIMARY KEY,
	member_id	INT,
	description	TEXT NOT NULL,
	FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);

CREATE TABLE trainer (
	id		SERIAL PRIMARY KEY,
	user_id	INT	UNIQUE,
	availability_type VARCHAR(15),
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE trainer_application (
	id		SERIAL PRIMARY KEY,
	user_id	INT	UNIQUE,
	resume TEXT,
	status VARCHAR(10),
	availability_type VARCHAR(15),
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE trainer_availability (
	id  SERIAL PRIMARY KEY,
	trainer_id INT,
	status	VARCHAR(15),
	start_time TIME,
	end_time TIME,
	date	DATE,
	FOREIGN KEY (trainer_id) REFERENCES trainer (id) ON DELETE CASCADE
);

CREATE TABLE expertise (
	id SERIAL PRIMARY KEY,
	expertise	VARCHAR(30) UNIQUE NOT NULL,
	trainer_id	INT,
	description	TEXT,
	FOREIGN KEY (trainer_id) REFERENCES trainer (id) ON DELETE CASCADE
);

CREATE TABLE room (
	id	SERIAL PRIMARY KEY
);

CREATE TABLE trains (
	id 				SERIAL PRIMARY KEY,
	trainer_id		INT,
	room_id			INT,
	availability_id	INT,
	FOREIGN KEY (trainer_id) REFERENCES trainer (id) ON DELETE CASCADE,
	FOREIGN KEY (room_id) REFERENCES room (id),
	FOREIGN KEY (availability_id) REFERENCES trainer_availability(id)
);

CREATE TABLE attendee (
	training_session_id	INT,
	member_id			INT,
	FOREIGN KEY (training_session_id) REFERENCES trains (id) ON DELETE CASCADE,
	FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE,
	PRIMARY KEY (training_session_id, member_id)
);

CREATE TABLE equipment (
	id					SERIAL PRIMARY KEY,
	name  				VARCHAR(40),
	type 				VARCHAR(40),
	maintenance_status  VARCHAR(3)
);