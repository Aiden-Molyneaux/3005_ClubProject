import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { getTrainerExpertise } from '../../util/helper.js';

export default function TrainerExpertiseSection() {
  const { state } = useAppState();
  const trainer = state.trainer;

  const [expertise, setExpertise] = useState([]);
  const [formData, setFormData] = useState({ 
    expertise: '', 
    description: '' 
  });
  const [formToggle, setFormToggle] = useState(false);

  useEffect(() => {
    if (trainer && trainer.id) {
      getTrainerExpertise(trainer.id).then((expertise) => {
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
    submitExpertise().then((expertise) => {
      setExpertise(prevExpertise => [...prevExpertise, expertise]);
    });

    setFormData({ expertise: '', description: '' });
    setFormToggle(false);
  }

  function submitExpertise() {
    return axios.post('http://localhost:3000/expertise', {
      expertise: formData.expertise,
      trainer_id: trainer.id,
      description: formData.description,
    })
    .then(response => {
      console.group('Expertise entry created successfully:', response.data);
      return response.data.expertise;
    })
    .catch(error => {
      console.error('Expertise entry creation error:', error);
    })
  }

  function deleteExpertise(expertise_id) {
    axios.delete(`http://localhost:3000/expertise/${expertise_id}`)
    .then(response => {
      console.group('Expertise entry deleted succesfully:', response.data);

      const newExpertise = expertise.filter((expertise) => expertise.id !== expertise_id);
      setExpertise(newExpertise);
    })
    .catch(error => {
      console.error('Expertise entry delete error:', error);
    })
  }


  const form_UI = (
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

  const noExpertise = expertise.length == 0;

  return (
    <div className='healthAnalyticsSection'>
      <h3>Trainer Expertise</h3>
      <div className='horizontalLine'></div>
      { noExpertise
        ? <h4>You currently have no expertise listed</h4>
        : <div className='goalSection'> { expertise && expertise.map((ex, index) => (
          <div key={index}> 
            <h4 className='underline'>Expertise #{index+1}</h4>
            <div><label>Expertise: {ex.expertise}</label></div>
            <div><label>Description: {ex.description}</label></div>
            <button className='topMargin' onClick={() => deleteExpertise(ex.id)}>Delete</button>
          </div>
          ))}
        </div>
      }

      { formToggle
        ? form_UI
        : <button onClick={() => setFormToggle(true)}>Add Expertise</button>
      }
    </div>
  );
}