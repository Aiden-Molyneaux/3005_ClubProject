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

async function getAllTrainersWithUserInfo() {
  return axios.get('http://localhost:3000/trainers_with_user')
  .then(response => {
    console.log('Trainers with user info fetched successfully:', response);
    return response.data.trainers_with_user || null;
  })
  .catch(error => {
    console.error('Trainers with user info fetch error:', error);
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

async function getTrainersWithAvailability() {
  return getAllTrainersWithUserInfo().then((trainers_with_user) => {
    return getAllTrainerAvailability().then((availabilities) => {
      let trainers_with_availability = {};

      for(const trainer of trainers_with_user) {
        trainers_with_availability[trainer.trainer_id] = {
          trainer: {
            trainer_id: trainer.trainer_id,
            first_name: trainer.first_name,
            last_name: trainer.last_name
          },
          availabilities: {}
        }
        for (const availability of availabilities) {
          if (trainer.trainer_id == availability.trainer_id) {
            // Check if the date key exists, if not, initialize it with an empty array
            if (!trainers_with_availability[trainer.trainer_id].availabilities[availability.date]) {
              trainers_with_availability[trainer.trainer_id].availabilities[availability.date] = [];
            }

            // Push availability to the array under the date key
            trainers_with_availability[trainer.trainer_id].availabilities[availability.date].push({
              availability_id: availability.id,
              start_time: availability.start_time,
              end_time: availability.end_time,
              status: availability.status,
              date: availability.date
            });
          }
        }
      }

      return trainers_with_availability;
    })
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
  return axios.patch(`http://localhost:3000/trainer_applications/${app_id}`, {
    status: newStatus,
  })
  .then(response => {
    console.log('Trainer application successfully updated:', response);
    return true;
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
        room_id: session.room_id,
        availability_id: session.availability_id,
        date: session.date,
        start_time: session.start_time,
        end_time: session.end_time,
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

async function getAllTrainerAvailability() {
  return axios.get('http://localhost:3000/trainer_availability')
  .then(response => {
    console.log('Trainer availabilities fetched successfully:', response);

    return response.data.trainer_availabilities || [];
  })
  .catch(error => {
    console.error('Trainer availabilities fetch error:', error);
  })
}

async function getTrainerAvailability(trainer_id) {
  return axios.get('http://localhost:3000/trainer_availability_with_trains', {
    params: {
      trainer_id: trainer_id
    }
  })
  .then(response => {
    console.log('Trainer availabilities with trains fetched successfully:', response);

    return response.data.trainer_availabilities || [];
  })
  .catch(error => {
    console.error('Trainer availabilities with trains fetch error:', error);
  })
}

async function updateTrainerAvailability(availability_id, newStatus) {
  // THIS FUNCTION SHOULD BE USED IN TrainerSchedule.jsx as well
  return axios.patch(`http://localhost:3000/trainer_availability/${availability_id}`, {
    status: newStatus
  })
  .then(response => {
    console.log('Trainer availability successfully updated:', response);
    return response;
  })
  .catch(error => {
    console.error('Trainer availability update error:', error);
  })
}

async function getTrainerExpertise(trainer_id) {
  return axios.get('http://localhost:3000/expertise')
  .then(response => {
    console.log('Trainer expertise fetched successfully:', response);
    const trainer_expertise = response.data.expertise.filter(expertise => expertise.trainer_id == trainer_id);
    return trainer_expertise || [];
  })
  .catch(error => {
    console.error('Trainer expertise fetch error:', error);
  })
}

export { 
  updateUserRole,
  getMember, 
  getTrainer,
  getTrainerApplication, 
  getTrainerAppsWithUserInfo,
  getTrainersWithAvailability,
  getEquipment,
  updateTrainerAppStatus,
  getMemberFitnessGoals,
  getMemberExerciseRoutines,
  getMemberTrainingSessions,
  getAllTrainerAvailability,
  getTrainerAvailability,
  updateTrainerAvailability,
  getTrainerExpertise
};