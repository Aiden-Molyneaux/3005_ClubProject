import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { getMemberFitnessGoals } from '../../util/helper.js';

export default function FitnessGoalSection() {
  const { state } = useAppState();
  const member = state.member;

  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({ goalText: '' });
  const [formToggle, setFormToggle] = useState(false);

  useEffect(() => {
    if (member && member.id) {
      getMemberFitnessGoals(member.id).then((goals) => {
        if (goals) {
          setGoals(goals);
        }
      });
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

    setFormData({ goalText: '' });
    setFormToggle(false);
  }

  function submitGoal() {
    return axios.post('http://localhost:3000/fitness_goals', {
      memberId: member.id,
      goalText: formData.goalText,
      status: false,
      dateCreated: new Date()
    })
      .then(response => {
        console.group('Fitness goal created successfully:', response.data);
        return response.data.fitness_goal;
      })
      .catch(error => {
        console.error('Fitness goal creation error:', error);
      });
  }

  function deleteGoal(goalId) {
    axios.delete(`http://localhost:3000/fitness_goals/${goalId}`)
      .then(response => {
        console.group('Fitness Goal deleted succesfully:', response.data);

        const newGoals = goals.filter((goal) => goal.id !== goalId);
        setGoals(newGoals);
      })
      .catch(error => {
        console.error('Exercise routine delete error:', error);
      });
  }

  function completeGoal(goalId) {
    axios.patch(`http://localhost:3000/fitness_goals/${goalId}`, {
      status: true
    })
      .then(response => {
        console.log('Fitness goal successfully updated:', response);

        const newGoals = goals.map((goal) => {
          if (goal.id === goalId) { goal.status = true; }
          return goal;
        });

        setGoals(newGoals);
      })
      .catch(error => {
        console.error('Fitness goal update error:', error);
      });
  }

  const formJSX = (
    <form onSubmit={handleSubmit}>
      <div className='horizontalLine'></div>
      <div>
        <label htmlFor='goalText'>Goal description:</label>
        <input type='text' name='goalText' value={formData.goalText} onChange={handleChange}></input>
      </div>

      <button className='topMargin rightMargin' type='submit'>Submit</button>
      <button className='topMargin rightMargin' onClick={() => setFormToggle(false)}>Close</button>
    </form>
  );

  return (
    <div className='healthAnalyticsSection bottomMargin'>
      <h3>Fitness Goals</h3>
      <div className='horizontalLine'></div>
      <div className="goalSection">
        { goals.length === 0
          ? <h4>You currently have no fitness goals</h4>
          : <> { goals && goals.map((goal, index) => (
            <div key={index} className='goalCard'> 
              <h4 className='underline'>Goal #{index+1}</h4>
              <label>Description: {goal.goal_text}</label>
              <br/>
              <label>Status: {goal.status ? 'Complete' : 'Working on it!'}</label>
              <br/>
              {!goal.status && <button className='rightMargin' onClick={() => completeGoal(goal.id)}>Complete</button>}
              <button className='topMargin' onClick={() => deleteGoal(goal.id)}>Delete</button>
            </div>
          ))}
          </>
        }
      </div>

      { formToggle && goals
        ? formJSX
        : <button className='topMargin' onClick={() => setFormToggle(true)}>Add Goal</button>
      }
    </div>
  );
}