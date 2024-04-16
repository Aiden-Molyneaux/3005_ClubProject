import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { 
  getFitnessGoals, 
  createFitnessGoal, 
  updateFitnessGoalStatus, 
  deleteFitnessGoal 
} from '../../util/helper.js';

export default function FitnessGoalSection() {
  const { state } = useAppState();
  const member = state.member;

  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({ goalText: '' });
  const [formToggle, setFormToggle] = useState(false);

  useEffect(() => {
    if (member && member.id) {
      getFitnessGoals(member.id).then((goals) => {
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
    createFitnessGoal({memberId: member.id, ...formData}).then((goal) => {
      setGoals(prevGoals => [...prevGoals, goal]);
    });

    setFormData({ goalText: '' });
    setFormToggle(false);
  }

  function deleteGoal(goalId) {
    deleteFitnessGoal(goalId).then(() => {
      const newGoals = goals.filter((goal) => goal.id !== goalId);
      setGoals(newGoals);
    });
  }

  function completeGoal(goalId) {
    updateFitnessGoalStatus(() => {
      const newGoals = goals.map((goal) => {
        if (goal.id === goalId) { goal.status = true; }
        return goal;
      });
  
      setGoals(newGoals);
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
    <div className='generalSection bottomMargin'>
      <h3>Fitness Goals</h3>
      <div className='horizontalLine'></div>
      <div className="goalSection">
        { goals.length === 0
          ? <h4>You currently have no fitness goals</h4>
          : <> { goals && goals.map((goal, index) => (
            <div key={index} className='goalCard'> 
              <h4 className='underline'>Goal #{index+1}</h4>
              <label>Description: {goal.goalText}</label>
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