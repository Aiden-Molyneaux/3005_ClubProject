import axios from 'axios';

async function updateUserRole(user_id, role) {
  axios.patch(`http://localhost:3000/users/${user_id}`, {
    role: role,
  })
  .then(response => {
    console.log('User successfully updated:', response);
  })
  .catch(error => {
    console.error('User update error:', error);
  })
}

async function getMember(user_id) {
  return axios.get('http://localhost:3000/members')
  .then(response => {
    const member = response.data.members.find((member) => {
      if (member.user_id == user_id) {
        console.log('Member fetched successfully:', response);
        return member;
      }
    });
    
    return member || null;
  })
  .catch(error => {
    console.error('Member fetch error:', error);
  })
}

async function getTrainer(user_id) {
  return axios.get('http://localhost:3000/trainers')
  .then(response => {
    const trainer = response.data.trainers.find((trainer) => {
      if (trainer.user_id == user_id) {
        console.log('Trainer fetched successfully:', response);
        return trainer;
      }
    });
    
    return trainer || null;
  })
  .catch(error => {
    console.error('Trainer fetch error:', error);
  })
}

async function getTrainerAppsWithUserInfo() {
  return axios.get('http://localhost:3000/trainer_applications_with_user')
  .then(response => {
    console.log('Trainer application and user info fetched successfully:', response);
    return response.data.trainer_applications || null;
  })
  .catch(error => {
    console.error('Trainer applications and user info fetch error:', error);
  })
}

async function getTrainerApplication(user_id) {
  return axios.get('http://localhost:3000/trainer_applications')
  .then(response => {
    const application = response.data.trainer_applications.find((application) => {
      if (application.user_id == user_id) {
        console.log('Trainer application fetched successfully:', response);
        return application;
      }
    });
    
    return application || null;
  })
  .catch(error => {
    console.error('Trainer application fetch error:', error);
  })
}

async function updateTrainerAppStatus(app_id, newStatus) {
  axios.patch(`http://localhost:3000/trainer_applications/${app_id}`, {
    status: newStatus,
  })
  .then(response => {
    console.log('Trainer application successfully updated:', response);
  })
  .catch(error => {
    console.error('Trainer application update error:', error);
  })
}

async function getEquipment() {
  return axios.get('http://localhost:3000/equipment')
  .then(response => {
    console.log('Equipment fetched successfully:', response);
    return response.data.equipment || null;
  })
  .catch(error => {
    console.error('Equipment fetch error:', error);
  })
}

async function getMemberFitnessGoals(member_id) {
  return axios.get('http://localhost:3000/fitness_goals')
  .then(response => {
    console.log('Fitness goals fetched successfully:', response);
    const fitness_goals = response.data.fitness_goals.filter(goal => goal.member_id == member_id);

    return fitness_goals || null;
  })
  .catch(error => {
    console.error('Fitness goals fetch error:', error);
  })
}

async function getMemberExerciseRoutines(member_id) {
  return axios.get('http://localhost:3000/exercise_routines')
  .then(response => {
    console.log('Exercise routines fetched successfully:', response);
    const exercise_routines = response.data.exercise_routines.filter(routine => routine.member_id == member_id);

    return exercise_routines || null;
  })
  .catch(error => {
    console.error('Exercise routines fetch error:', error);
  })
}

async function getMemberTrainingSessions(member_id) {
  return axios.get('http://localhost:3000/training_sessions')
  .then(response => {
    console.log('Training sessions fetched successfully:', response);
    const training_sessions = response.data.training_sessions.filter(session => session.member_id == member_id);

    const formatted_sessions = training_sessions.map((session) => {
      return {
        id: session.training_session_id,
        timeslot: session.timeslot,
        session_length: session.session_length,
        room_id: session.room_id,
        trainer: {
          id: session.trainer_id,
          user_id: session.user_id,
          username: session.username,
          first_name: session.first_name,
          last_name: session.last_name,
          email: session.email
        },
      }
    });

    return formatted_sessions || null;
  })
  .catch(error => {
    console.error('Training sessions fetch error:', error);
  })
}

async function getTrainerAvailability(trainer_id) {
  return axios.get('http://localhost:3000/trainer_availability')
  .then(response => {
    console.log('Trainer availabilities fetched successfully:', response);

    let trainer_availability = response.data.trainer_availabilities;
    if (trainer_availability !== null && trainer_availability.length > 0) {
      trainer_availability = trainer_availability.filter(availability => availability.trainer_id == trainer_id);
      return trainer_availability;
    }

    return [];
  })
  .catch(error => {
    console.error('Trainer availabilities fetch error:', error);
  })
}

export { 
  updateUserRole,
  getMember, 
  getTrainer,
  getTrainerApplication, 
  getTrainerAppsWithUserInfo, 
  getEquipment,
  updateTrainerAppStatus,
  getMemberFitnessGoals,
  getMemberExerciseRoutines,
  getMemberTrainingSessions,
  getTrainerAvailability
};