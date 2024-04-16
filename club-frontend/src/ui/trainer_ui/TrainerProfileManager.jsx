import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAppState } from '../../AppState.jsx';
import { 
  deleteTrainingSessionsByTrainerId,
  createTrainerAvailability,
  updateTrainerAvailabilityType,
  deleteTrainerAvailability
} from '../../util/helper.js';

export default function TrainerProfileManager({ reloadTrainerSchedule }) {
  TrainerProfileManager.propTypes = {
    reloadTrainerSchedule: PropTypes.func.isRequired
  };

  const { state, dispatch } = useAppState();

  const [trainer, setTrainer] = useState(state.trainer);
  const [formData, setFormData] = useState({ availabilityType: trainer.availabilityType });

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name] : event.target.value });
  }
 
  function handleSubmit(event) {
    event.preventDefault();
    
    updateTrainerAvailabilityType(trainer.id, formData.availabilityType).then((trainer) =>  {
      setTrainer(trainer);
      dispatch({ type: 'resource_fetched', payload: { trainer } });

      deleteTrainingSessionsByTrainerId(trainer.id).then(() => {
        deletePreviousAvailability(trainer.id).then(() => {
          createTrainerAvailability(trainer.id, trainer.availabilityType).then(() => {
            reloadTrainerSchedule();
          });
        });
      });
    });
  }

  function deletePreviousAvailability(trainerId) {
    return deleteTrainerAvailability(trainerId);
  }

  return (
    <div className='generalSection'>
      <h3>Manage your Schedule and Availability</h3>
      <div className='horizontalLine'></div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Availability:</label>
          <select name="availabilityType" value={formData.availabilityType} onChange={handleChange}>
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