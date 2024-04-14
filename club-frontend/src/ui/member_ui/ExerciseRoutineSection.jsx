import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { getMemberExerciseRoutines } from '../../util/helper.js';

export default function ExerciseRoutineSection() {
  const { state } = useAppState();
  const member = state.member;

  const [routines, setRoutines] = useState([]);
  const [formData, setFormData] = useState({ description: '' });
  const [formToggle, setFormToggle] = useState(false);

  useEffect(() => {
    if (member && member.id) {
      getMemberExerciseRoutines(member.id).then((routines) => {
        if (routines) {
          setRoutines(routines);
        }
      });
    }
  }, [member]);

  function handleChange(event) {
    setFormData({ [event.target.name] : event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitRoutine().then((routine) => {
      setRoutines(prevRoutines => [...prevRoutines, routine]);
    });

    setFormData({ description: '' });
    setFormToggle(false);
  }

  function submitRoutine() {
    return axios.post('http://localhost:3000/exercise_routines', {
      memberId: member.id,
      description: formData.description
    })
      .then(response => {
        console.group('Exercise routine created successfully:', response.data);
        return response.data.exercise_routine;
      })
      .catch(error => {
        console.error('Exercise routine creation error:', error);
      });
  }

  function deleteRoutine(routineId) {
    axios.delete(`http://localhost:3000/exercise_routines/${routineId}`)
      .then(response => {
        console.group('Exercise routine created deleted:', response.data);

        const newRoutines = routines.filter((routine) => routine.id !== routineId);
        setRoutines(newRoutines);
      })
      .catch(error => {
        console.error('Exercise routine delete error:', error);
      });
  }

  const formJSX = (
    <form onSubmit={handleSubmit}>
      <div className='horizontalLine'></div>
      <div>
        <label htmlFor='description'>Routine description:</label>
        <input type='text' name='description' value={formData.description} onChange={handleChange}></input>
      </div>

      <button className='rightMargin' type='submit'>Submit</button>
      <button onClick={() => setFormToggle(false)}>Close</button>
    </form>
  );

  return (
    <div className='healthAnalyticsSection'>
      <h3>Exercise Routines</h3>
      <div className='horizontalLine'></div>
      <div className='goalSection'>
        { routines.length === 0
          ? <h4>You currently have no exercise routines</h4>
          : <>
            { routines && routines[0].description && routines.map((routine, index) => (
              <div key={index}> 
                <h4 className='underline'>Routine #{index+1}</h4>
                <label>{routine.description}</label>
                <br/>
                <button className='topMargin' onClick={() => deleteRoutine(routine.id)}>Delete</button>
              </div>
            ))}
          </>
        }
      </div>

      { formToggle
        ? formJSX
        : <button className='topMargin' onClick={() => setFormToggle(true)}>Add Routine</button>
      }
    </div>
  );
}