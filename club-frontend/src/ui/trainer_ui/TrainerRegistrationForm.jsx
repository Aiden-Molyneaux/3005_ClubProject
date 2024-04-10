import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAppState } from '../../AppState.jsx';

export default function TrainerRegistrationForm({ setTrainerRegToggle }) {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const user = state.user;
  const [trainerAppData, setTrainerAppData] = useState(null);
  const [formData, setFormData] = useState({
    resume: '',
    availability_type: 'afternoon'
  });

  useEffect(() => {
    if (!window.localStorage.getItem('auth')) {
      navigate('/auth/login');
    }
  });

  useEffect(() => {
    if (trainerAppData) {
      dispatch({ type: 'trainer_application_submitted', payload: { 
        trainer_application: {
          id: trainerAppData.id,
          user_id: trainerAppData.user_id,
          resume: trainerAppData.resume,
          status: trainerAppData.status,
          availability_type: trainerAppData.availability_type
        }
      }});
    }
  }, [trainerAppData]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name] : event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitTrainerApplication().then((trainer_application) => setTrainerAppData(trainer_application));
  }

  function submitTrainerApplication() {
    return axios.post('http://localhost:3000/trainer_applications', {
      user_id: user.id,
      resume: formData.resume,
      status: 'Awaiting',
      availability_type: formData.availability_type
    })
    .then(response => {
      console.log('Trainer application submission successful:', response);
      return response.data.trainer_application;
    })
    .catch(error => {
      console.error('Trainer application submission error:', error);
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Resume:</label>
        <input type="text" name="resume" value={formData.resume} onChange={handleChange}/>
      </div>

      <div>
        <label>Availability:</label>
        <select name="availability_type" value={formData.availability_type} onChange={handleChange}>
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
  )
}