import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../AppState.jsx';
import { getMember } from '../../util/helper.js';
import MemberFitnessProfile from './MemberFitnessProfile.jsx';
import MemberProfileManager from './MemberProfileManager.jsx';
import MemberSchedule from './MemberSchedule.jsx';

export default function MemberDashboard() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

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

  const profileView = (
    <>
      <MemberFitnessProfile/>
      <MemberProfileManager/>
    </>
  )

  const scheduleView = (
    <>
      <MemberSchedule/>
    </>
  );

  // const isMemberReady = member && member.id;
  return (
    <>
      <button onClick={() => setProfileToggle(true)}>Your Profile and Fitness Hub</button>
      <button onClick={() => setProfileToggle(false)}>Your Schedule</button>
      { profileToggle && member
        ? profileView
        : scheduleView
      }
    </>
  );
}