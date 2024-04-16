import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAppState } from '../../AppState.jsx';
import { updateUserRole, createMember }  from '../../util/helper.js';

export default function MemberRegistrationForm({ setMemRegToggle }) {
  MemberRegistrationForm.propTypes = {
    setMemRegToggle: PropTypes.func.isRequired
  };

  const navigate = useNavigate();
  
  const { state, dispatch } = useAppState();
  const user = state.user;

  const [memberData, setMemberData] = useState(null);
  const [formData, setFormData] = useState({
    gender: '',
    birthDate: 'YYYY-MM-DD',
    weight: 0,
    height: 0
  });

  useEffect(() => {
    if (!window.localStorage.getItem('auth')) {
      navigate('/auth/login');
    }
  });

  useEffect(() => {
    if (memberData) {
      dispatch({ type: 'member_registered', payload: { member: { ...memberData } }});

      updateUserRole(memberData.userId, 'member');
      navigate('/dashboard');
    }
  }, [memberData]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name] : event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    createMember({
      userId: user.id,
      ...formData
    }).then((member) => setMemberData(member));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='innerRegForm'>
        <div>
          <label>Birth date:</label>
          <input type="text" name="birthDate" value={formData.birthDate} onChange={handleChange}/>
        </div>

        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="empty">--</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label>Weight:</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange}/>
        </div>

        <div>
          <label>Height (cm):</label>
          <input type="number" name="height" value={formData.height} onChange={handleChange}/>
        </div>

        <div className='formButtons'>
          <button type="submit">Submit</button>
          <button onClick={() => setMemRegToggle(false)}>Close</button>
        </div>
      </div>
    </form>
  );
}