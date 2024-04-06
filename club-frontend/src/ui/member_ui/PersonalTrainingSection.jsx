import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../AppState.jsx';
import { getMemberTrainingSessions } from '../../util/helper.js';

export default function PersonalTrainingSection() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const user = state.user;
  const member = state.member;

  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({ goal_text: '' })
  const [formToggle, setFormToggle] = useState(false);

  useEffect(() => {
    if (member && member.id) {
      getMemberTrainingSessions(member.id).then((sessions) => setSessions(sessions));
    }
  }, [member]);

  function handleChange(event) {
    setFormData({ [event.target.name] : event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitGoal().then((goal) => {
      setGoals(prevGoals => [...prevGoals, goal]);
    });

    setFormData({ goal_text: '' });
    setFormToggle(false);
  }

  function submitGoal() {
    return axios.post('http://localhost:3000/fitness_goals', {
      member_id: member.id,
      goal_text: formData.goal_text,
      status: false,
      display: true,
      date_created: new Date()
    })
    .then(response => {
      console.group('Fitness goal created successfully:', response.data);
      return response.data.fitness_goal;
    })
    .catch(error => {
      console.error('Fitness goal creation error:', error);
    })
  }

  function cancelSession(session_id) {
    axios.delete(`http://localhost:3000/fitness_goals/${goal_id}`)
    .then(response => {
      console.group('Fitness Goal deleted succesfully:', response.data);

      const newGoals = goals.filter((goal) => goal.id !== goal_id);
      setGoals(newGoals);
    })
    .catch(error => {
      console.error('Exercise routine delete error:', error);
    })
  }


  const form_UI = (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='goal_text'>Goal description:</label>
        <input type='text' name='goal_text' value={formData.goal_text} onChange={handleChange}></input>
      </div>

      <button type='submit'>Submit</button>
      <button onClick={() => setFormToggle(false)}>Close</button>
    </form>
  );

  const noSessions = sessions.length == 0;

  return (
    <>
      <h2>Personal Training Sessions</h2>
      <div>
        { noSessions
          ? <h4>You currently have no sessions booked</h4>
          : <> { sessions && sessions.map((session, index) => (
            <div key={index}> 
              <h3>Session #{index+1}:</h3>
              <h4>Trainer: {session.trainer.first_name + ' ' + session.trainer.last_name}</h4>
              <h4>Timeslot: {session.timeslot}</h4>
              <button onClick={() => cancelSession(session.id)}>Delete</button>
            </div>
            ))}
          </>
        }
      </div>

      { formToggle
        ? form_UI
        : <button onClick={() => setFormToggle(true)}>Book session</button>
      }
      
    </>
  );
}