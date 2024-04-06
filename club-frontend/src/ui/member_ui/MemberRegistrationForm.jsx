import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAppState } from '../../AppState.jsx';
import { updateUserRole }  from '../../util/helper.js';

export default function MemberRegistrationForm(props) {
  MemberRegistrationForm.propTypes = {
    user_id: Number
  }

  const { dispatch } = useAppState();
  const navigate = useNavigate();

  const [memberData, setMemberData] = useState(null);
  const [membershipFormData, setMembershipFormData] = useState({
    gender: '',
    birth_date: 'YYYY-MM-DD',
    weight: 0
  });

  useEffect(() => {
    if (!window.localStorage.getItem('auth')) {
      navigate('/auth/login');
    }
  });

  useEffect(() => {
    if (memberData) {
      dispatch({ type: 'member_registered', payload: { 
        member: {
          id: memberData.id,
          user_id: memberData.user_id,
          gender: memberData.gender,
          birth_date: memberData.birth_date,
          weight: memberData.weight
        }
      }});

      // update user role in DB
      updateUserRole(memberData.user_id, 'member');

      navigate('/dashboard');
    }
  }, [memberData]);

  function handleChange(event) {
    setMembershipFormData({ ...membershipFormData, [event.target.name] : event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitMemberRegistration().then((member) => setMemberData(member));
  }

  function submitMemberRegistration() {
    return axios.post('http://localhost:3000/members', {
      user_id: props.user_id,
      gender: membershipFormData.gender,
      birth_date: membershipFormData.birth_date,
      weight: membershipFormData.weight
    })
    .then(response => {
      console.log('Membership registration successful:', response);
      return response.data.member;
    })
    .catch(error => {
      console.error('Member registration error:', error);
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          <label>Birth date:</label>
          <input type="text" name="birth_date" value={membershipFormData.birth_date} onChange={handleChange}/>
        </div>

        <div>
          <label>Gender:</label>
          <select name="gender" value={membershipFormData.gender} onChange={handleChange}>
            <option value="empty">--</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label>Weight:</label>
          <input type="number" name="weight" value={membershipFormData.weight} onChange={handleChange}/>
        </div>

        <button type="submit">Submit</button>
       </div>
    </form>
  )
}