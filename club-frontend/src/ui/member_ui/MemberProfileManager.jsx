import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../AppState.jsx';
import ProfileManager from '../ProfileManager.jsx';

export default function MemberProfileManager() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const [member, setMember] = useState(state.member);

  const [memberFormData, setMemberFormData] = useState({
    gender: member.gender,
    birth_date: member.birth_date,
    weight: member.weight
  });

  function handleMemberChange(event) {
    setMemberFormData({ ...memberFormData, [event.target.name] : event.target.value });
  }

  function handleMemberSubmit(event) {
    event.preventDefault();
    submitMemberProfileUpdate().then((member) => {
      setMember(member);
      dispatch({ type: 'member_updated', payload: {member} });
    });
  }

  function submitMemberProfileUpdate() {
    return axios.put(`http://localhost:3000/members/${member.id}`, {
      gender: memberFormData.gender,
      birth_date: memberFormData.birth_date,
      weight: memberFormData.weight
    })
    .then(response => {
      console.log('Member update successful:', response);
      return response.data.member;
    })
    .catch(error => {
      console.error('Member update error:', error);
    })
  }

  return (
    <>
      <ProfileManager/>

      <form onSubmit={handleMemberSubmit}>
        <div>
          <label>Birth date:</label>
          <input type="text" name="birth_date" value={memberFormData.birth_date} onChange={handleMemberChange}/>
        </div>

        <div>
          <label>Gender:</label>
          <select name="gender" value={memberFormData.gender} onChange={handleMemberChange}>
            <option value="empty">--</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label>Weight:</label>
          <input type="number" name="weight" value={memberFormData.weight} onChange={handleMemberChange}/>
        </div>

        {/* <div>
          <label>Height:</label>
          <input type="text" name="height" value={.email} onChange={handleChange}/>
        </div> */}

        <button type="submit">Save member profile</button>
      </form>
    </>
  );
}