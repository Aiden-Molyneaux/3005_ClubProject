import axios from 'axios';

// AUTHENTICATION CRUD
async function login({username, password}) {
  return axios.post('http://localhost:3000/auth/login', {
    username,
    password
  })
    .then(response => {
      console.log('Login successful:', response);
      return response.data.user;
    })
    .catch(error => {
      console.error('Login error:', error);
    });
}

async function signup({username, password, firstName, lastName, email}) {
  return axios.post('http://localhost:3000/auth/signup', {
    username,
    password,
    firstName,
    lastName,
    email
  })
    .then(response => {
      console.log('Sign-up successful:', response.data);
      return response.data.user;
    })
    .catch(error => {
      console.error('Sign-up error:', error);
    });
}

// USER CRUD
async function updateUser({userId, username, firstName, lastName, email, role}) {
  return axios.put(`http://localhost:3000/users/${userId}`, {
    username,
    firstName,
    lastName,
    email,
    role
  })
    .then(response => {
      console.log('User profile update successful:', response);
      return response.data.user;
    })
    .catch(error => {
      console.error('User profile update error:', error);
    });
}

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

// MEMBER CRUD
async function getMember(userId) {
  return axios.get('http://localhost:3000/members')
    .then(response => {
      const member = response.data.members.find((member) => {
        if (member.userId === userId) {
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

async function createMember({userId, gender, birthDate, weight, height}) {
  return axios.post('http://localhost:3000/members', {
    userId,
    gender,
    birthDate,
    weight,
    height
  })
    .then(response => {
      console.log('Membership registration successful:', response);
      return response.data.member;
    })
    .catch(error => {
      console.error('Member registration error:', error);
    });
}

async function updateMember({memberId, gender, birthDate, weight, height}) {
  return axios.put(`http://localhost:3000/members/${memberId}`, {
    gender,
    birthDate,
    weight,
    height
  })
    .then(response => {
      console.log('Member update successful:', response);
      return response.data.member;
    })
    .catch(error => {
      console.error('Member update error:', error);
    });
}

// EXERCISE ROUTINE CRUD
async function getExerciseRoutines(memberId) {
  return axios.get('http://localhost:3000/exercise_routines')
    .then(response => {
      console.log('Exercise routines fetched successfully:', response);
      const exerciseRoutines = response.data.exerciseRoutines.filter(routine => routine.memberId === memberId);

      return exerciseRoutines || null;
    })
    .catch(error => {
      console.error('Exercise routines fetch error:', error);
    });
}

async function createExerciseRoutine({memberId, description}) {
  return axios.post('http://localhost:3000/exercise_routines', {
    memberId: memberId,
    description: description
  })
    .then(response => {
      console.log('Exercise routine created successfully:', response.data);
      return response.data.exerciseRoutine;
    })
    .catch(error => {
      console.error('Exercise routine creation error:', error);
    });
}

async function deleteExerciseRoutine(routineId) {
  axios.delete(`http://localhost:3000/exercise_routines/${routineId}`)
    .then(response => {
      console.log('Exercise routine deleted successfully:', response.data);
      return true;
    })
    .catch(error => {
      console.error('Exercise routine delete error:', error);
    });
}

// FITNESS GOAL CRUD
async function getFitnessGoals(memberId) {
  return axios.get('http://localhost:3000/fitness_goals')
    .then(response => {
      console.log('Fitness goals fetched successfully:', response);
      const fitnessGoals = response.data.fitnessGoals.filter(goal => goal.memberId === memberId);

      return fitnessGoals || null;
    })
    .catch(error => {
      console.error('Fitness goals fetch error:', error);
    });
}

async function createFitnessGoal({memberId, goalText}) {
  return axios.post('http://localhost:3000/fitness_goals', {
    memberId,
    goalText,
    status: false,
    dateCreated: new Date()
  })
    .then(response => {
      console.log('Fitness goal created successfully:', response.data);
      return response.data.fitnessGoal;
    })
    .catch(error => {
      console.error('Fitness goal creation error:', error);
    });
}

async function updateFitnessGoalStatus(goalId) {
  axios.patch(`http://localhost:3000/fitness_goals/${goalId}`, {
    status: true
  })
    .then(response => {
      console.log('Fitness goal successfully updated:', response);
    })
    .catch(error => {
      console.error('Fitness goal update error:', error);
    });
}

async function deleteFitnessGoal(goalId) {
  axios.delete(`http://localhost:3000/fitness_goals/${goalId}`)
    .then(response => {
      console.log('Fitness Goal deleted succesfully:', response.data);
    })
    .catch(error => {
      console.error('Exercise routine delete error:', error);
    });
}

// ATTENDEE CRUD
async function createAttendee(trainingSessionId, memberId) {
  axios.post('http://localhost:3000/attendees', {
    trainingSessionId,
    memberId
  })
    .then(response => {
      console.log('Attendee created successfully:', response.data);
    })
    .catch(error => {
      console.error('Attendee creation error:', error);
    });
}

// TRAINING SESSION CRUD
async function getTrainingSessions(memberId) {
  return axios.get('http://localhost:3000/training_sessions')
    .then(response => {
      console.log('Training sessions fetched successfully:', response);
      const trainingSessions = response.data.trainingSessions.filter(session => session.memberId === memberId);

      const formattedSessions = trainingSessions.map((session) => {
        return {
          id: session.trainingSessionId,
          roomId: session.roomId,
          availabilityId: session.availabilityId,
          date: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          trainer: {
            id: session.trainerId,
            userId: session.userId,
            username: session.username,
            firstName: session.firstName,
            lastName: session.lastName,
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

async function createTrainingSession(trainerId, roomId, availabilityId) {
  return axios.post('http://localhost:3000/training_sessions', {
    trainerId,
    roomId,
    availabilityId
  })
    .then(response => {
      console.log('Training session created successfully:', response.data);
      return response.data.trainingSession;
    })
    .catch(error => {
      console.error('Training session creation error:', error);
    });
}

async function deleteTrainingSessionById(trainingSessionId) {
  return axios.delete(`http://localhost:3000/training_sessions/${trainingSessionId}`)
    .then(response => {
      console.log('Training session deleted successfully:', response.data);
      return true;
    })
    .catch(error => {
      console.error('Training session delete error:', error);
    });
}

async function deleteTrainingSessionsByTrainerId(trainerId) {
  return axios.delete('http://localhost:3000/training_sessions_by_trainer', {
    params: {
      trainerId
    }
  })
    .then(response => {
      console.log('Training session deleted successfully:', response);
      return response;
    })
    .catch(error => {
      console.error('Training session update error:', error);
    });
}

// TRAINER CRUD
async function getTrainer(userId) {
  return axios.get('http://localhost:3000/trainers')
    .then(response => {
      const trainer = response.data.trainers.find((trainer) => {
        if (trainer.userId === userId) {
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

async function createTrainer(userId, availabilityType) {
  return axios.post('http://localhost:3000/trainers', {
    userId,
    availabilityType
  })
    .then(response => {
      console.log('Trainer successfully created:', response.data);
      return response.data.trainer;
    })
    .catch(error => {
      console.error('Trainer creation error:', error);
    });
}

async function getAllTrainersWithUserInfo() {
  return axios.get('http://localhost:3000/trainers_with_user')
    .then(response => {
      console.log('Trainers with user info fetched successfully:', response);
      return response.data.trainersWithUsers || null;
    })
    .catch(error => {
      console.error('Trainers with user info fetch error:', error);
    });
}

async function getTrainersWithAvailability() {
  return getAllTrainersWithUserInfo().then((trainersWithUsers) => {
    return getAllTrainerAvailability().then((availabilities) => {
      let trainersWithAvailability = {};

      for(const trainer of trainersWithUsers) {
        trainersWithAvailability[trainer.trainerId] = {
          trainer: {
            trainerId: trainer.trainerId,
            firstName: trainer.firstName,
            lastName: trainer.lastName
          },
          availabilities: {}
        };

        for (const availability of availabilities) {
          if (trainer.trainerId === availability.trainerId) {
            // Check if the date key exists, if not, initialize it with an empty array
            if (!trainersWithAvailability[trainer.trainerId].availabilities[availability.date]) {
              trainersWithAvailability[trainer.trainerId].availabilities[availability.date] = [];
            }

            // Push availability to the array under the date key
            trainersWithAvailability[trainer.trainerId].availabilities[availability.date].push({
              availabilityId: availability.id,
              startTime: availability.startTime,
              endTime: availability.endTime,
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

async function updateTrainerAvailabilityType(trainerId, availabilityType) {
  return axios.patch(`http://localhost:3000/trainers/${trainerId}`, {
    availabilityType
  })
    .then(response => {
      console.log('Trainers availabilityType updated successfully:', response);
      return response.data.trainer;
    })
    .catch(error => {
      console.error('Trainers availabilityType update error:', error);
    });
}

// TRAINER APPLICATION CRUD
async function getTrainerApplication(userId) {
  return axios.get('http://localhost:3000/trainer_applications')
    .then(response => {
      const application = response.data.trainerApplications.find((application) => {
        if (application.userId === userId) {
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

async function createTrainerApplication({userId, resume, status, availabilityType}) {
  return axios.post('http://localhost:3000/trainer_applications', {
    userId,
    status,
    resume,
    availabilityType
  })
    .then(response => {
      console.log('Trainer application submission successful:', response);
      return response.data.trainerApplication;
    })
    .catch(error => {
      console.error('Trainer application submission error:', error);
    });
}

async function getTrainerAppsWithUserInfo() {
  return axios.get('http://localhost:3000/trainer_applications_with_user')
    .then(response => {
      console.log('Trainer application and user info fetched successfully:', response);
      return response.data.trainerApplications || null;
    })
    .catch(error => {
      console.error('Trainer applications and user info fetch error:', error);
    });
}

async function updateTrainerApplicationStatus(applicationId, newStatus) {
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

// TRAINER AVAILABILITY CRUD
async function getTrainerAvailability(trainerId) {
  return axios.get('http://localhost:3000/trainer_availability_with_trains', {
    params: {
      trainerId
    }
  })
    .then(response => {
      console.log('Trainer availabilities with trains fetched successfully:', response);      
      return response.data.trainerAvailabilities || [];
    })
    .catch(error => {
      console.error('Trainer availabilities with trains fetch error:', error);
    });
}

async function getAllTrainerAvailability() {
  return axios.get('http://localhost:3000/trainer_availability')
    .then(response => {
      console.log('Trainer availabilities fetched successfully:', response);

      return response.data.trainerAvailabilities || [];
    })
    .catch(error => {
      console.error('Trainer availabilities fetch error:', error);
    });
}

async function createTrainerAvailability(trainerId, availabilityType) {
  return axios.post('http://localhost:3000/trainer_availability', {
    trainerId,
    availabilityType
  })
    .then(response => {
      console.log('Trainer availability successfully created:', response.data);
      return true;
    })
    .catch(error => {
      console.error('Trainer availability creation error:', error);
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

async function deleteTrainerAvailability(trainerId) {
  return axios.delete(`http://localhost:3000/trainer_availability/${trainerId}`)
    .then(response => {
      console.log('Trainer availability deleted successfully:', response);
      return response;
    })
    .catch(error => {
      console.error('Trainer availability update error:', error);
    });
}

// EXPERTISE CRUD
async function getExpertise(trainerId) {
  return axios.get('http://localhost:3000/expertise')
    .then(response => {
      console.log('Trainer expertise fetched successfully:', response);
      const trainerExpertise = response.data.expertise.filter(expertise => expertise.trainerId === trainerId);
      return trainerExpertise || [];
    })
    .catch(error => {
      console.error('Trainer expertise fetch error:', error);
    });
}

async function createExpertise({trainerId, expertise, description}) {
  return axios.post('http://localhost:3000/expertise', {
    trainerId,  
    expertise,
    description
  })
    .then(response => {
      console.log('Expertise entry created successfully:', response.data);
      return response.data.expertise;
    })
    .catch(error => {
      console.error('Expertise entry creation error:', error);
    });
}

async function deleteExpertise(expertiseId) {
  return axios.delete(`http://localhost:3000/expertise/${expertiseId}`)
    .then(response => {
      console.log('Expertise entry deleted succesfully:', response.data);
      return true;
    })
    .catch(error => {
      console.error('Expertise entry delete error:', error);
    });
}

// EQUIPMENT CRUD
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

async function updateEquipmentStatus(equipmentId) {
  return axios.patch(`http://localhost:3000/equipment/${equipmentId}`, {
    maintenanceStatus: 'No'
  })
    .then(response => {
      console.log('Equipment successfully updated:', response);
      return true;
    })
    .catch(error => {
      console.error('Equipment update error:', error);
    });
}

export {
  login,
  signup,
  updateUser,
  updateUserRole,
  getMember,
  createMember,
  updateMember,
  getFitnessGoals,
  createFitnessGoal,
  updateFitnessGoalStatus,
  deleteFitnessGoal,
  createAttendee,
  getTrainingSessions,
  createTrainingSession,
  deleteTrainingSessionById,
  deleteTrainingSessionsByTrainerId,
  getExerciseRoutines,
  createExerciseRoutine,
  deleteExerciseRoutine,
  getTrainer,
  getTrainersWithAvailability,
  createTrainer,
  updateTrainerAvailabilityType,
  getTrainerApplication, 
  getTrainerAppsWithUserInfo,
  createTrainerApplication,
  updateTrainerApplicationStatus,
  getTrainerAvailability,
  getAllTrainerAvailability,
  createTrainerAvailability,
  updateTrainerAvailability,
  deleteTrainerAvailability,
  getExpertise,
  createExpertise,
  deleteExpertise,
  getEquipment,
  updateEquipmentStatus
};