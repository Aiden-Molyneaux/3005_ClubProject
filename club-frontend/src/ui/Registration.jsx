import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../AppState.jsx';
import MemberRegistrationForm from './member_ui/MemberRegistrationForm.jsx';
import TrainerRegistrationForm from './trainer_ui/TrainerRegistrationForm.jsx';
import { getTrainerApplication } from '../util/helper.js';

export default function Registration() {
  const navigate = useNavigate();

  const { state, dispatch } = useAppState();
  const user = state.user ? state.user : null;
  const trainerApplication = state.trainerApplication ? state.trainerApplication : null;

  const [memRegToggle, setMemRegToggle] = useState(true);
  const [trainerRegToggle, setTrainerRegToggle] = useState(false);

  useEffect(() => {
    if(!user) {
      navigate('/auth/login');
    } else if (user.role !== 'none') {
      navigate('/dashboard');
    }

    getTrainerApplication(user.id).then((trainerApplication) => {
      if (trainerApplication) {
        dispatch({ type: 'trainer_application_submitted', payload: {trainerApplication} });
      }
    });
  }, []);

  function toggleForms(type) {
    if (type === 'member') {
      setMemRegToggle(true);
      setTrainerRegToggle(false);
    } else {
      setMemRegToggle(false);
      setTrainerRegToggle(true);
    }
  }

  function logout() {
    dispatch({ type: 'logout', payload: {} });
    navigate('/auth/login');
  } 

  return (
    <>
      <div className='regLogoutBanner bottomMargin'>
        <h3>Hi {user.firstName}, </h3>
        <button onClick={() => logout()}>Logout?</button>
      </div>

      <div className='healthAnalyticsSection'>
        <h3>Register for a Membership</h3>
        <div className='horizontalLine'></div>
        { memRegToggle
          ? <MemberRegistrationForm setMemRegToggle={setMemRegToggle}/>
          : <button className='topMargin' onClick={() => toggleForms('member')}>Register</button>
        }

        <h2>OR</h2>
        
        <h3>Request a Trainer position</h3>
        <div className='horizontalLine'></div>
        { trainerApplication 
          ? <h6>You have successfully submitted an application</h6>
          : trainerRegToggle
            ? <TrainerRegistrationForm setTrainerRegToggle={setTrainerRegToggle}/>
            : <button className='topMargin' onClick={() => toggleForms('trainer')}>Apply</button>
        }
      </div>
    </>
  );
}