import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { updateTrainerAvailability } from '../../util/helper.js';
import { getTrainerAvailability } from '../../util/helper.js';

export default function TrainerSchedule({ reload }) {
  const { state } = useAppState();

  const trainer = state.trainer;
  const [trainerAvailabilities, setTrainerAvailabilities] = useState([]);

  const [dates, setDates] = useState({}); 
  const [reloadFlag, setReloadFlag] = useState(false);

  const [formData, setFormData] = useState({
    date: ''
  });

  useEffect(() => {
    if (trainer) {
      getTrainerAvailability(trainer.id).then((availability) => {
        if (availability && availability.length > 0) {
          setTrainerAvailabilities(availability);
        }
      });
    }
  }, [trainer, reloadFlag, reload]);

  useEffect(() => {
    if (trainerAvailabilities) {
      const sortedAvailabilities = trainerAvailabilities.sort((a, b) => a.id - b.id);
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

  function setAvailability(availability_id, status) {
    axios.patch(`http://localhost:3000/trainer_availability/${availability_id}`, {
      status: status
    })
    .then(response => {
      console.log('Trainer availability updated successfully:', response);
      setReloadFlag(!reloadFlag);
    })
    .catch(error => {
      console.error('Trainer availability update error:', error);
    })
  }

  function cancelSession(training_session_id, availability_id) {
    deleteTrainingSession(training_session_id).then(() => {
      updateTrainerAvailability(availability_id, 'available').then(() => {
        setReloadFlag(!reloadFlag);
      });
    })
  }

  function deleteTrainingSession(training_session_id) {
    return axios.delete(`http://localhost:3000/training_sessions/${training_session_id}`)
    .then(response => {
      console.group('Training session deleted successfully:', response.data);
      return true;
    })
    .catch(error => {
      console.error('Training session delete error:', error);
    })
  }

  return (
    <>
      { dates &&
      <div className='healthAnalyticsSection'>
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
                  <td>{availability.start_time}</td>
                  <td>{availability.end_time}</td>
                  <td>{availability.status}</td>
                  <td>
                    { availability.status == 'available'
                      ? <button onClick={() => setAvailability(availability.id, 'unavailable')}>Set to unavailable</button>
                      : availability.status == 'unavailable'
                        ? <button onClick={() => setAvailability(availability.id, 'available')}>Set to available</button>
                        : <button onClick={() => cancelSession(availability.training_session_id, availability.id)}>Cancel session</button>
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