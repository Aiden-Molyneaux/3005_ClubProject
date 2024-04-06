import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../AppState.jsx';

export default function TrainerSchedule({ trainer_prop, availability_prop }) {
  const { state, dispatch } = useAppState();

  const [trainer, setTrainer] = useState(trainer_prop);
  const [availabilities, setAvailabilities] = useState(availability_prop);

  const [dates, setDates] = useState({}); 

  const [formData, setFormData] = useState({
    date: ''
  });

  useEffect(() => {
    if (availabilities) {
      const sortedAvailabilities = availabilities.sort((a, b) => a.id - b.id);
      const newDates = {};
      sortedAvailabilities.forEach((availability) => {
        newDates[availability.date] = availability.date;
      });
      setDates(newDates);

      const initialDate = Object.keys(newDates)[0];
      setFormData({ date: initialDate });
    }
  }, [availabilities]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name] : event.target.value });
  }

  function setAvailability(availability_id, status) {
    axios.patch(`http://localhost:3000/trainer_availability/${availability_id}`, {
      status: status
    })
    .then(response => {
      console.log('Trainer availability updated successfully:', response);

      let newAvailabilities = availabilities.filter(availability => availability.id !== availability_id);
      newAvailabilities.push(response.data.trainer_availability);
      newAvailabilities = newAvailabilities.sort((a, b) => a.id - b.id)

      setAvailabilities(newAvailabilities);
    })
    .catch(error => {
      console.error('Trainer availability update error:', error);
    })
  }

  function cancelTrainingSession() {}

  return (
    <>
      { dates &&
      <>
        <label>Date</label>
        <select name="date" value={formData.date} onChange={handleChange}>
          {Object.keys(dates).map(date => (
            <option key={date} value={date}>{dates[date].split('T')[0]}</option>
          ))}
        </select>
        <table>
          <thead>
            <tr>
              <th>Start time</th>
              <th>End time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            { availabilities
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
                        : <button onClick={() => cancelTrainingSession(availability.id)}>Cancel session</button>
                    }
                    
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </>
    }
    </>
  );
}