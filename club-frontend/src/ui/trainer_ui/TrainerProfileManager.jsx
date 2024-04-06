import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../AppState.jsx';
import ProfileManager from '../ProfileManager.jsx';

export default function TrainerProfileManager({ trainer_prop, availability_prop }) {
  const { state, dispatch } = useAppState();

  const [trainer, setTrainer] = useState(trainer_prop);

  console.log({trainer})
  
  const [availabilities, setAvailabilities] = useState(availability_prop);
  const [formData, setFormData] = useState({
    availability_type: trainer.availability_type
  });

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name] : event.target.value });
  }
 
  function handleSubmit(event) {
    event.preventDefault();
    submitAvailabilityUpdate().then((trainer) =>  {
      setTrainer(trainer);
      dispatch({ type: 'resource_fetched', payload: {trainer} });

      console.log({trainer})

      deletePreviousAvailabilities().then(() => {
        createNewAvailabilities();
      });
    });
  }

  function submitAvailabilityUpdate() {
    return axios.patch(`http://localhost:3000/trainers/${trainer.id}`, {
      availability_type: formData.availability_type
    })
    .then(response => {
      console.log('Trainer availability updated successfully:', response);

      /*
      -> trainer updates their availability type
      -> update trainer entity
      -> delete trainer's trainer_availability entries
      -> populate trainer_availability with new trainer_availability entries
      */

      return response.data.trainer;
    })
    .catch(error => {
      console.error('Trainer availability update error:', error);
    })
  }

  function deletePreviousAvailabilities() {
    return axios.delete(`http://localhost:3000/trainer_availability/${trainer.id}`)
    .then(response => {
      console.log('Trainer availability deleted successfully:', response);

      return response;
    })
    .catch(error => {
      console.error('Trainer availability update error:', error);
    })
  }

  function createNewAvailabilities() {
    axios.post('http://localhost:3000/trainer_availability', {
      trainer_id: trainer.id,
      availability_type: formData.availability_type
    })
    .then(response => {
      console.log('Trainer availabilities created successfully:', response);
    })
    .catch(error => {
      console.error('Trainer availability update error:', error);
    })
  }

  console.log(availabilities);

  return (
    <>
      <ProfileManager/>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Availability:</label>
          <select name="availability_type" value={formData.availability_type} onChange={handleChange}>
            <option value="morning">6am-2pm</option>
            <option value="afternoon">8am-4pm</option>
            <option value="evening">12pm-8pm</option>
          </select>
        </div>

        <button type="submit">Save availability</button>
      </form>
    </>
  );
}