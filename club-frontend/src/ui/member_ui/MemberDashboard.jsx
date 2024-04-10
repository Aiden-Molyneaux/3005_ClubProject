import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { getMember } from '../../util/helper.js';
import MemberFitnessProfile from './MemberFitnessProfile.jsx';
import MemberProfileManager from './MemberProfileManager.jsx';
import MemberSchedule from './MemberSchedule.jsx';

export default function MemberDashboard() {
  const { state, dispatch } = useAppState();

  const user = state.user;
  const member = state.member;

  const [profileToggle, setProfileToggle] = useState(true);

  useEffect(() => {
    getMember(user.id).then((member) => {
      if (member) {
        dispatch({ type: 'resource_fetched', payload: {member} })
      }
    });
  }, []);

  return (
    <>
      <div className='memberViewOptions'>
        <button className={profileToggle ? 'underline' : ''} onClick={() => setProfileToggle(true)}>Your Profile and Fitness Hub</button>
        <button className={!profileToggle ? 'underline' : ''} onClick={() => setProfileToggle(false)}>Your Schedule</button>
      </div>

      { profileToggle && member
        ? <MemberFitnessProfile/>
        : <MemberSchedule/>
      }
    </>
  );
}