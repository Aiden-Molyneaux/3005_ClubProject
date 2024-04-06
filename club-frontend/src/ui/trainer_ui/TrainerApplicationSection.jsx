import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { getTrainerAppsWithUserInfo, updateTrainerAppStatus, updateUserRole } from '../../util/helper.js';

export default function TrainerApplicationSection() {
  const { state, dispatch } = useAppState();

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getTrainerAppsWithUserInfo().then((trainer_applications) => {
      if (trainer_applications) {
        let unconfirmedApplications = trainer_applications.filter(application => 
          application.status == null
        );

        setApplications(unconfirmedApplications);
      }
    })
  }, []);

  function approveTrainer(application) {
    updateTrainerAppStatus(application.id, 'Approved');
    updateUserRole(application.user_id, 'trainer');

    return axios.post('http://localhost:3000/trainers', {
      user_id: application.user_id,
      availability_type: application.availability_type
    })
    .then(response => {
      console.group('Trainer successfully created:', response.data);
      const trainer = response.data.trainer; 
      createTrainerAvailabilitySlots(trainer, application);
      
      return trainer;
    })
    .catch(error => {
      console.error('Trainer creation error:', error);
    });
  }

  function createTrainerAvailabilitySlots(trainer) {
    axios.post('http://localhost:3000/trainer_availability', {
      trainer_id: trainer.id,
      availability_type: trainer.availability_type
    })
    .then(response => {
      console.group('Trainer availability successfully created:', response.data);
    })
    .catch(error => {
      console.error('Trainer availability creation error:', error);
    });
  }

  function denyTrainer(application) {
    updateTrainerAppStatus(application.id, 'Denied');
  }

  const no_applications = applications.length == 0 ? true : false;

  return (
    <>
      <h3>Active Trainer Applications:</h3>
      { no_applications
        ? <h6>There are no active applications</h6>
        : <table>
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Resume</th>
                <th>Availability</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(application => (
                <tr key={application.id}>
                  <td>{application.id}</td>
                  <td>{application.username}</td>
                  <td>{application.first_name + ' ' + application.last_name}</td>
                  <td>{application.email}</td>
                  <td>{application.resume}</td>
                  <td>{application.availability_type}</td>
                  <td>
                    <button onClick={() => approveTrainer(application)}>Yes</button>
                    <button onClick={() => denyTrainer(application)}>No</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      }
    </>

  );
}