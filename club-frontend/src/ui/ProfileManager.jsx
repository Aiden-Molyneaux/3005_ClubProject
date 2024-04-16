import { useState } from 'react';
import { useAppState } from '../AppState.jsx';
import { updateUser } from '../util/helper.js';

export default function ProfileManager() {
  const { state, dispatch } = useAppState();

  const [user, setUser] = useState(state.user);
  const [formData, setFormData] = useState({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  });

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name] : event.target.value });
  }
 
  function handleSubmit(event) {
    event.preventDefault();
    submitUserProfileUpdate().then((user) =>  {
      setUser(user);
      dispatch({ type: 'user_updated', payload: { user } });
    });
  }

  function submitUserProfileUpdate() {
    return updateUser({
      userId: user.id, 
      ...formData, 
      role: user.role
    });
  }

  return (
    <div className='generalSection'>
      <form onSubmit={handleSubmit}>
        <h3>Manage your Personal Profile</h3>
        <div className='horizontalLine'></div>
        <div>
          <label htmlFor='username'>Username:</label>
          <input type='text' name='username' value={formData.username} onChange={handleChange}/>
        </div>

        <div>
          <label htmlFor='firstName'>First Name:</label>
          <input type='text' name='firstName' value={formData.firstName} onChange={handleChange}/>
        </div>

        <div>
          <label htmlFor='lastName'>Last Name:</label>
          <input type='text' name='lastName' value={formData.lastName} onChange={handleChange}/>
        </div>

        <div>
          <label htmlFor='email'>Email:</label>
          <input type='text' name='email' value={formData.email} onChange={handleChange}/>
        </div>

        <button className='topMargin' type='submit'>Save personal profile</button>
      </form>
    </div>
  );
}