import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { 
  deleteTrainingSessionById,
  getTrainerAvailability,
  updateTrainerAvailability
} from '../../util/helper.js';

export default function TrainerSchedule({ reloadSchedule }) {
  TrainerSchedule.propTypes = {
    reloadSchedule: PropTypes.bool.isRequired
  };

  const { state } = useAppState();
  const trainer = state.trainer;

  const [trainerAvailabilities, setTrainerAvailabilities] = useState([]);
  const [dates, setDates] = useState({}); 
  const [reloadFlag, setReloadFlag] = useState(false);
  const [formData, setFormData] = useState({ date: '' });

  useEffect(() => {
    if (trainer) {
      getTrainerAvailability(trainer.id).then((availability) => {
        if (availability && availability.length > 0) {
          setTrainerAvailabilities(availability);
        }
      });
    }
  }, [trainer, reloadFlag, reloadSchedule]);

  useEffect(() => {
    if (trainerAvailabilities) {
      const sortedAvailabilities = trainerAvailabilities.sort((a, b) => a.id - b.id);
      console.log({sortedAvailabilities});
      const newDates = {};
      sortedAvailabilities.forEach((availability) => {
        newDates[availability.date] = availability.date;
      });
      setDates(newDates);

      const initialDate = Object.keys(newDates)[0];
      setFormData({ date: initialDate });
    }
  }, [trainerAvailabilities]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name] : event.target.value });
  }

  function setAvailability(availabilityId, status) {
    updateTrainerAvailability(availabilityId, status).then(() => {
      setReloadFlag(!reloadFlag);
    });
  }

  function cancelSession(trainingSessionId, availabilityId) {
    deleteTrainingSessionById(trainingSessionId).then(() => {
      updateTrainerAvailability(availabilityId, 'available').then(() => {
        setReloadFlag(!reloadFlag);
      });
    });
  }

  return (
    <>
      { dates &&
      <div className='generalSection'>
        <h3>Manage your Schedule</h3>
        <div className='horizontalLine'></div>
        <div> 
          <label>Date: </label>
          <select name="date" value={formData.date} onChange={handleChange}>
            {Object.keys(dates).map(date => (
              <option key={date} value={date}>{dates[date].split('T')[0]}</option>
            ))}
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th className='underline'>Start time</th>
              <th className='underline'>End time</th>
              <th className='underline'>Status</th>
            </tr>
          </thead>
          <tbody>
            { trainerAvailabilities && trainerAvailabilities
              .filter(availability => availability.date === formData.date)
              .sort((a, b) => a.id - b.id)
              .map((availability, index) => (
                <tr key={index}>
                  <td>{availability.startTime}</td>
                  <td>{availability.endTime}</td>
                  <td>{availability.status}</td>
                  <td>
                    { availability.status === 'available'
                      ? <button onClick={() => setAvailability(availability.id, 'unavailable')}>Set to unavailable</button>
                      : availability.status === 'unavailable'
                        ? <button onClick={() => setAvailability(availability.id, 'available')}>Set to available</button>
                        : <button onClick={() => cancelSession(availability.trainingSessionId, availability.id)}>Cancel session</button>
                    }
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      }
    </>
  );
}