import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../AppState.jsx';
import { getTrainer } from '../../util/helper.js';
import { getTrainerAvailability } from '../../util/helper.js';
import TrainerProfileManager from './TrainerProfileManager.jsx';
import TrainerSchedule from './TrainerSchedule.jsx';

export default function TrainerDashboard() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const user = state.user;
  const [trainer, setTrainer] = useState(state.trainer);

  const [availabilities, setAvailabilities] = useState(null);
  const [profileToggle, setProfileToggle] = useState(true);

  useEffect(() => {
    if (trainer) {
      getTrainerAvailability(trainer.id).then((availability) => {
        if (availability) {
          setAvailabilities(availability);
        }
      });
    }
  }, [trainer]);

  useEffect(() => {
    getTrainer(user.id).then((trainer) => {
      if (trainer) {
        setTrainer(trainer);
        dispatch({ type: 'resource_fetched', payload: {trainer} })
      }
    });
  }, [user.id]);

  return (
    <>
      <h3>Your Trainer Hub</h3>
      {trainer && availabilities &&
        <>
          <TrainerProfileManager
            trainer_prop={trainer}
            availability_prop={availabilities}
          />
          <TrainerSchedule
            trainer_prop={trainer}
            availability_prop={availabilities}
          />  
        </>
      }
    </>
  );
}