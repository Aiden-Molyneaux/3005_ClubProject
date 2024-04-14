import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { getMember } from '../../util/helper.js';
import MemberFitnessProfile from './MemberFitnessProfile.jsx';
import MemberSchedule from './MemberSchedule.jsx';

export default function MemberDashboard() {
  const { state, dispatch } = useAppState();
  const user = state.user;
  const member = state.member;

  const [viewToggle, setViewToggle] = useState(true);

  useEffect(() => {
    getMember(user.id).then((member) => {
      if (member) {
        dispatch({ type: 'resource_fetched', payload: { member } });
      }
    });
  }, []);

  return (
    <>
      <div className='memberViewOptions'>
        <button className={viewToggle ? 'underline' : ''} onClick={() => setViewToggle(true)}>Your Profile and Fitness Hub</button>
        <button className={!viewToggle ? 'underline' : ''} onClick={() => setViewToggle(false)}>Your Schedule</button>
      </div>

      { viewToggle && member
        ? <MemberFitnessProfile/>
        : <MemberSchedule/>
      }
    </>
  );
}