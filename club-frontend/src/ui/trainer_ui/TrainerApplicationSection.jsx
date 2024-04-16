import { useState, useEffect } from 'react';
import {
  updateUserRole,
  createTrainer,
  getTrainerAppsWithUserInfo, 
  updateTrainerApplicationStatus, 
  createTrainerAvailability
} from '../../util/helper.js';

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
    updateTrainerApplicationStatus(application.id, 'Approved');
    updateUserRole(application.userId, 'trainer');
    createTrainer(application.userId, application.availabilityType).then((trainer) => {
      createTrainerAvailability(trainer.id, trainer.availabilityType);
      setReloadAppsFlag(!reloadAppsFlag);
    });
  }

  function denyTrainer(application) {
    updateTrainerApplicationStatus(application.id, 'Denied').then(() => setReloadAppsFlag(!reloadAppsFlag));
  }

  return (
    <div className='generalSection'>
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
                <td>{application.firstName + ' ' + application.lastName}</td>
                <td>{application.email}</td>
                <td>{application.resume}</td>
                <td>{application.availabilityType}</td>
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