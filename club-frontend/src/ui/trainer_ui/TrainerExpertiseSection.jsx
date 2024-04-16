import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { getExpertise, createExpertise, deleteExpertise } from '../../util/helper.js';

export default function TrainerExpertiseSection() {
  const { state } = useAppState();
  const trainer = state.trainer;

  const [expertise, setExpertise] = useState([]);
  const [formData, setFormData] = useState({ expertise: '', description: '' });
  const [formToggle, setFormToggle] = useState(false);

  useEffect(() => {
    if (trainer && trainer.id) {
      getExpertise(trainer.id).then((expertise) => {
        if (expertise) {
          setExpertise(expertise);
        }
      });
    }
  }, [trainer]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name] : event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    createExpertise({
      trainerId: trainer.id,
      ...formData
    }).then((expertise) => {
      setExpertise(prevExpertise => [...prevExpertise, expertise]);
    });

    setFormData({ expertise: '', description: '' });
    setFormToggle(false);
  }

  function deleteExpertiseEntry(expertiseId) {
    deleteExpertise(expertiseId).then(() => {
      const newExpertise = expertise.filter((expertise) => expertise.id !== expertiseId);
      setExpertise(newExpertise);
    });
  }

  const formJSX = (
    <form onSubmit={handleSubmit}>
      <div className='horizontalLine'></div>
      <div>
        <label>Expertise name:</label>
        <input type='text' name='expertise' value={formData.expertise} onChange={handleChange}></input>
      </div>

      <div>
        <label>Description:</label>
        <input type='text' name='description' value={formData.description} onChange={handleChange}></input>
      </div>

      <button className='topMargin rightMargin' type='submit'>Submit</button>
      <button onClick={() => setFormToggle(false)}>Close</button>
    </form>
  );

  return (
    <div className='generalSection'>
      <h3>Trainer Expertise</h3>
      <div className='horizontalLine'></div>
      { expertise.length === 0
        ? <h4>You currently have no expertise listed</h4>
        : <div className='goalSection'> { expertise && expertise.map((ex, index) => (
          <div key={index}> 
            <h4 className='underline'>Expertise #{index+1}</h4>
            <div><label>Expertise: {ex.expertise}</label></div>
            <div><label>Description: {ex.description}</label></div>
            <button className='topMargin' onClick={() => deleteExpertiseEntry(ex.id)}>Delete</button>
          </div>
        ))}
        </div>
      }

      { formToggle
        ? formJSX
        : <button onClick={() => setFormToggle(true)}>Add Expertise</button>
      }
    </div>
  );
}