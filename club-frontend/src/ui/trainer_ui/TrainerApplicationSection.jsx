import axios from 'axios';
import { useState, useEffect } from 'react';
import { getTrainerAppsWithUserInfo, updateTrainerAppStatus, updateUserRole } from '../../util/helper.js';

export default function TrainerApplicationSection() {
  const [applications, setApplications] = useState([]);
  const [reloadAppsFlag, setReloadAppsFlag] = useState(false);

  useEffect(() => {
    getTrainerAppsWithUserInfo().then((trainerApplications) => {
      if (trainerApplications) {
        let unconfirmedApplications = trainerApplications.filter(application => application.status === 'Awaiting');

        setApplications(unconfirmedApplications);
      }
    });
  }, [reloadAppsFlag]);

  function approveTrainer(application) {
    updateTrainerAppStatus(application.id, 'Approved');
    updateUserRole(application.user_id, 'trainer');

    return axios.post('http://localhost:3000/trainers', {
      userId: application.user_id,
      availabilityType: application.availability_type
    })
      .then(response => {
        console.group('Trainer successfully created:', response.data);
        const trainer = response.data.trainer; 
        createTrainerAvailabilitySlots(trainer, application);
        setReloadAppsFlag(!reloadAppsFlag);

        return trainer;
      })
      .catch(error => {
        console.error('Trainer creation error:', error);
      });
  }

  function createTrainerAvailabilitySlots(trainer) {
    axios.post('http://localhost:3000/trainer_availability', {
      trainerId: trainer.id,
      availabilityType: trainer.availability_type
    })
      .then(response => {
        console.group('Trainer availability successfully created:', response.data);
        setReloadAppsFlag(!reloadAppsFlag);
      })
      .catch(error => {
        console.error('Trainer availability creation error:', error);
      });
  }

  function denyTrainer(application) {
    updateTrainerAppStatus(application.id, 'Denied').then(() => setReloadAppsFlag(!reloadAppsFlag));
  }

  return (
    <div className='healthAnalyticsSection'>
      <h3>Active Trainer Applications</h3>
      <div className='horizontalLine'></div>
      { applications.length === 0
        ? <h6>There are no active applications</h6>
        : <table className='topMargin'>
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
                  <button className='rightMargin' onClick={() => approveTrainer(application)}>Yes</button>
                  <button onClick={() => denyTrainer(application)}>No</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}