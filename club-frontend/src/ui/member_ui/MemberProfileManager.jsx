import { useState } from 'react';
import { useAppState } from '../../AppState.jsx';
import { updateMember } from '../../util/helper.js';

export default function MemberProfileManager() {
  const { state, dispatch } = useAppState();
  
  const [member, setMember] = useState(state.member);
  const [formData, setMemberFormData] = useState({
    gender: member.gender,
    birthDate: member.birthDate,
    weight: member.weight,
    height: member.height
  });

  function handleChange(event) {
    setMemberFormData({ ...formData, [event.target.name] : event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateMember({memberId: member.id, ...formData}).then((member) => {
      setMember(member);
      dispatch({ type: 'member_updated', payload: { member } });
    });
  }

  return (
    <div className='generalSection'>
      <form onSubmit={handleSubmit}>
        <h3>Manage your Member Profile</h3>
        <div className='horizontalLine'></div>
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
          <label>Height:</label>
          <input type="number" name="height" value={formData.height} onChange={handleChange}/>
        </div>

        <button className='topMargin' type="submit">Save member profile</button>
      </form>
    </div>
  );
}