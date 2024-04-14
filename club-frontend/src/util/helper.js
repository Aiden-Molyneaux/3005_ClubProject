import axios from 'axios';

async function updateUserRole(userId, role) {
  axios.patch(`http://localhost:3000/users/${userId}`, {
    role: role,
  })
    .then(response => {
      console.log('User successfully updated:', response);
    })
    .catch(error => {
      console.error('User update error:', error);
    });
}

async function getMember(userId) {
  return axios.get('http://localhost:3000/members')
    .then(response => {
      const member = response.data.members.find((member) => {
        if (member.user_id === userId) {
          console.log('Member fetched successfully:', response);
          return member;
        }
      });
    
      return member || null;
    })
    .catch(error => {
      console.error('Member fetch error:', error);
    });
}

async function getTrainer(userId) {
  return axios.get('http://localhost:3000/trainers')
    .then(response => {
      const trainer = response.data.trainers.find((trainer) => {
        if (trainer.user_id === userId) {
          console.log('Trainer fetched successfully:', response);
          return trainer;
        }
      });
    
      return trainer || null;
    })
    .catch(error => {
      console.error('Trainer fetch error:', error);
    });
}

async function getAllTrainersWithUserInfo() {
  return axios.get('http://localhost:3000/trainers_with_user')
    .then(response => {
      console.log('Trainers with user info fetched successfully:', response);
      return response.data.trainers_with_user || null;
    })
    .catch(error => {
      console.error('Trainers with user info fetch error:', error);
    });
}

async function getTrainerAppsWithUserInfo() {
  return axios.get('http://localhost:3000/trainer_applications_with_user')
    .then(response => {
      console.log('Trainer application and user info fetched successfully:', response);
      return response.data.trainer_applications || null;
    })
    .catch(error => {
      console.error('Trainer applications and user info fetch error:', error);
    });
}

async function getTrainersWithAvailability() {
  return getAllTrainersWithUserInfo().then((trainersWithUser) => {
    return getAllTrainerAvailability().then((availabilities) => {
      let trainersWithAvailability = {};

      for(const trainer of trainersWithUser) {
        trainersWithAvailability[trainer.trainer_id] = {
          trainer: {
            trainerId: trainer.trainer_id,
            firstName: trainer.first_name,
            lastName: trainer.last_name
          },
          availabilities: {}
        };

        for (const availability of availabilities) {
          if (trainer.trainer_id === availability.trainer_id) {
            // Check if the date key exists, if not, initialize it with an empty array
            if (!trainersWithAvailability[trainer.trainer_id].availabilities[availability.date]) {
              trainersWithAvailability[trainer.trainer_id].availabilities[availability.date] = [];
            }

            // Push availability to the array under the date key
            trainersWithAvailability[trainer.trainer_id].availabilities[availability.date].push({
              availabilityId: availability.id,
              startTime: availability.start_time,
              endTime: availability.end_time,
              status: availability.status,
              date: availability.date
            });
          }
        }
      }

      return trainersWithAvailability;
    });
  });
}

async function getTrainerApplication(userId) {
  return axios.get('http://localhost:3000/trainer_applications')
    .then(response => {
      const application = response.data.trainer_applications.find((application) => {
        if (application.user_id === userId) {
          console.log('Trainer application fetched successfully:', response);
          return application;
        }
      });
    
      return application || null;
    })
    .catch(error => {
      console.error('Trainer application fetch error:', error);
    });
}

async function updateTrainerAppStatus(applicationId, newStatus) {
  return axios.patch(`http://localhost:3000/trainer_applications/${applicationId}`, {
    status: newStatus,
  })
    .then(response => {
      console.log('Trainer application successfully updated:', response);
      return true;
    })
    .catch(error => {
      console.error('Trainer application update error:', error);
    });
}

async function getEquipment() {
  return axios.get('http://localhost:3000/equipment')
    .then(response => {
      console.log('Equipment fetched successfully:', response);
      return response.data.equipment || null;
    })
    .catch(error => {
      console.error('Equipment fetch error:', error);
    });
}

async function getMemberFitnessGoals(memberId) {
  return axios.get('http://localhost:3000/fitness_goals')
    .then(response => {
      console.log('Fitness goals fetched successfully:', response);
      const fitnessGoals = response.data.fitness_goals.filter(goal => goal.member_id === memberId);

      return fitnessGoals || null;
    })
    .catch(error => {
      console.error('Fitness goals fetch error:', error);
    });
}

async function getMemberExerciseRoutines(memberId) {
  return axios.get('http://localhost:3000/exercise_routines')
    .then(response => {
      console.log('Exercise routines fetched successfully:', response);
      const exerciseRoutines = response.data.exercise_routines.filter(routine => routine.member_id === memberId);

      return exerciseRoutines || null;
    })
    .catch(error => {
      console.error('Exercise routines fetch error:', error);
    });
}

async function getMemberTrainingSessions(memberId) {
  return axios.get('http://localhost:3000/training_sessions')
    .then(response => {
      console.log('Training sessions fetched successfully:', response);
      const trainingSessions = response.data.training_sessions.filter(session => session.member_id === memberId);

      const formattedSessions = trainingSessions.map((session) => {
        return {
          id: session.training_session_id,
          roomId: session.room_id,
          availabilityId: session.availability_id,
          date: session.date,
          startTime: session.start_time,
          endTime: session.end_time,
          trainer: {
            id: session.trainer_id,
            userId: session.user_id,
            username: session.username,
            firstName: session.first_name,
            lastName: session.last_name,
            email: session.email
          },
        };
      });

      return formattedSessions || null;
    })
    .catch(error => {
      console.error('Training sessions fetch error:', error);
    });
}

async function getAllTrainerAvailability() {
  return axios.get('http://localhost:3000/trainer_availability')
    .then(response => {
      console.log('Trainer availabilities fetched successfully:', response);

      return response.data.trainer_availabilities || [];
    })
    .catch(error => {
      console.error('Trainer availabilities fetch error:', error);
    });
}

async function getTrainerAvailability(trainerId) {
  return axios.get('http://localhost:3000/trainer_availability_with_trains', {
    params: {
      trainerId
    }
  })
    .then(response => {
      console.log('Trainer availabilities with trains fetched successfully:', response);

      return response.data.trainer_availabilities || [];
    })
    .catch(error => {
      console.error('Trainer availabilities with trains fetch error:', error);
    });
}

async function updateTrainerAvailability(availabilityId, newStatus) {
  // THIS FUNCTION SHOULD BE USED IN TrainerSchedule.jsx as well
  return axios.patch(`http://localhost:3000/trainer_availability/${availabilityId}`, {
    status: newStatus
  })
    .then(response => {
      console.log('Trainer availability successfully updated:', response);
      return response;
    })
    .catch(error => {
      console.error('Trainer availability update error:', error);
    });
}

async function getTrainerExpertise(trainerId) {
  return axios.get('http://localhost:3000/expertise')
    .then(response => {
      console.log('Trainer expertise fetched successfully:', response);
      const trainerExpertise = response.data.expertise.filter(expertise => expertise.trainer_id === trainerId);
      return trainerExpertise || [];
    })
    .catch(error => {
      console.error('Trainer expertise fetch error:', error);
    });
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