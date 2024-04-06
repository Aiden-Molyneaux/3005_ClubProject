import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../AppState.jsx';
import MemberRegistrationForm from './member_ui/MemberRegistrationForm.jsx';
import TrainerRegistrationForm from './trainer_ui/TrainerRegistrationForm.jsx';
import { getTrainerApplication } from '../util/helper.js';

export default function Registration() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [memRegToggle, setMemRegToggle] = useState(true);
  const [trainerRegToggle, setTrainerRegToggle] = useState(false);

  const user = state.user ? state.user : null;
  const trainer_application = state.trainer_application ? state.trainer_application : null;

  useEffect(() => {
    if(!user) {
      navigate('/auth/login');
    } else if (user.role != 'none') {
      navigate('/dashboard');
    }

    getTrainerApplication(user.id).then((trainer_application) => {
      if (trainer_application) {
        dispatch({ type: 'trainer_application_submitted', payload: {trainer_application} })
      }
    });
  }, []);

  const openMemRegForm = (
    <div>
      <MemberRegistrationForm user_id={user.id}/>
      <button onClick={() => setMemRegToggle(false)}>Close</button>
    </div>
  );

  const openTrainerRegForm = (
    <div>
      <TrainerRegistrationForm/>
      <button onClick={() => setTrainerRegToggle(false)}>Close</button>
    </div>
  );

  function toggleForms(type) {
    if (type == 'member') {
      setMemRegToggle(true);
      setTrainerRegToggle(false);
    } else {
      setMemRegToggle(false);
      setTrainerRegToggle(true);
    }
  }

  return (
    <>
      <h1>Hi, {user.first_name}</h1>
        <div>
        <h3>Register for a Membership</h3>
        { memRegToggle
          ? openMemRegForm
          : <button onClick={() => toggleForms('member')}>Register</button>
        }
        
        <h3>Request a Trainer position</h3>
        { trainer_application 
          ? <h6>You have successfully submitted an application</h6>
          : trainerRegToggle
            ? openTrainerRegForm
            : <button onClick={() => toggleForms('trainer')}>Apply</button>
        }
      </div>
    </>
  );
}

/*
-> non-member requests trainer position
-> attaches a resume -- resume can be included on trainer table
-> optional, include expertise
-> admin is required to approve or deny application

- need new relation, trainer_applications
- trainer applications are hosted on the admin page

- under the "Request a Trainer position" there will be a section for previous applications and the status
*/