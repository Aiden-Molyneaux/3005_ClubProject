import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { getTrainer } from '../../util/helper.js';
import TrainerProfileManager from './TrainerProfileManager.jsx';
import TrainerExpertiseSection from './TrainerExpertiseSection.jsx';
import TrainerSchedule from './TrainerSchedule.jsx';
import ProfileManager from '../ProfileManager.jsx';

export default function TrainerDashboard() {
  const { state, dispatch } = useAppState();
  const user = state.user;
  const trainer = state.trainer;

  const [reloadSchedule, setReloadSchedule] = useState(false);

  useEffect(() => {
    getTrainer(user.id).then((trainer) => {
      if (trainer) {
        dispatch({ type: 'resource_fetched', payload: { trainer } });
      }
    });
  }, [user.id]);

  function reloadTrainerSchedule() {
    setReloadSchedule(!reloadSchedule);
  }

  return (
    <>
      {trainer &&
        <div>
          <div className='memberProfileSection noTopMargin'>
            <ProfileManager/>
            <TrainerProfileManager reloadTrainerSchedule={reloadTrainerSchedule}/>
          </div>
          <div className='memberProfileSection'>
            <TrainerSchedule reloadSchedule={reloadSchedule}/>
            <TrainerExpertiseSection/>
          </div>
        </div>
      }
    </>
  );
}