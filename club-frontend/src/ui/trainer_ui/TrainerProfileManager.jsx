import axios from 'axios';
import { useState } from 'react';
import { useAppState } from '../../AppState.jsx';

export default function TrainerProfileManager({ reloadTrainerSchedule }) {
  const { state, dispatch } = useAppState();
  const [trainer, setTrainer] = useState(state.trainer);
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

      deleteTrainingSessions(trainer.id).then(() => {
        deletePreviousAvailabilities().then(() => {
          createNewAvailabilities().then(() => {
            reloadTrainerSchedule();
          });
        });
      });
    });
  }

  function submitAvailabilityUpdate() {
    return axios.patch(`http://localhost:3000/trainers/${trainer.id}`, {
      availability_type: formData.availability_type
    })
    .then(response => {
      console.log('Trainers availability_type updated successfully:', response);
      return response.data.trainer;
    })
    .catch(error => {
      console.error('Trainers availability_type update error:', error);
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
    return axios.post('http://localhost:3000/trainer_availability', {
      trainer_id: trainer.id,
      availability_type: formData.availability_type
    })
    .then(response => {
      console.log('Trainer availabilities created successfully:', response);
      return true;
    })
    .catch(error => {
      console.error('Trainer availability update error:', error);
    })
  }

  function deleteTrainingSessions(trainer_id) {
    console.log({trainer});
    return axios.delete('http://localhost:3000/training_sessions_by_trainer', {
      params: {
        trainer_id: trainer_id
      }
    })
    .then(response => {
      console.log('Training session deleted successfully:', response);
      return response;
    })
    .catch(error => {
      console.error('Training session update error:', error);
    })
  }

  return (
    <div className='healthAnalyticsSection'>
      <h3>Manage your Schedule and Availability</h3>
      <div className='horizontalLine'></div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Availability:</label>
          <select name="availability_type" value={formData.availability_type} onChange={handleChange}>
            <option value="morning">6am-2pm</option>
            <option value="afternoon">8am-4pm</option>
            <option value="evening">12pm-8pm</option>
          </select>
        </div>

        <button className='topMargin' type="submit">Save availability</button>
      </form>
    </div>
  );
}