import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAppState } from '../../AppState.jsx';
import { createTrainerApplication } from '../../util/helper.js';

export default function TrainerRegistrationForm({ setTrainerRegToggle }) {
  TrainerRegistrationForm.propTypes = {
    setTrainerRegToggle: PropTypes.func.isRequired
  };

  const navigate = useNavigate();

  const { state, dispatch } = useAppState();
  const user = state.user;

  const [trainerAppData, setTrainerAppData] = useState(null);
  const [formData, setFormData] = useState({ resume: '', availabilityType: 'afternoon' });

  useEffect(() => {
    if (!window.localStorage.getItem('auth')) { navigate('/auth/login'); }
  });

  useEffect(() => {
    if (trainerAppData) {
      dispatch({ type: 'trainer_application_submitted', payload: { trainerApplication: { ...trainerAppData } }});
    }
  }, [trainerAppData]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name] : event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    createTrainerApplication({
      userId: user.id, 
      status: 'Awaiting',
      ...formData
    }).then((trainerApplication) => setTrainerAppData(trainerApplication));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='resume'>Resume:</label>
        <input type="text" name="resume" value={formData.resume} onChange={handleChange}/>
      </div>

      <div>
        <label htmlFor='availabilityType'>Availability:</label>
        <select name="availabilityType" value={formData.availabilityType} onChange={handleChange}>
          <option value="morning">6am-2pm</option>
          <option value="afternoon">8am-4pm</option>
          <option value="evening">12pm-8pm</option>
        </select>
      </div>

      <div>
        <button className='topMargin rightMargin' type="submit">Submit</button>
        <button className='topMargin' onClick={() => setTrainerRegToggle(false)}>Close</button>
      </div>
    </form>
  );
}