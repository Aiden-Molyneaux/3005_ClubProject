import axios from 'axios';
import { useState } from 'react';
import { useAppState } from '../AppState.jsx';

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
    return axios.put(`http://localhost:3000/users/${user.id}`, {
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: user.role
    })
      .then(response => {
        console.log('User profile update successful:', response);
        return response.data.user;
      })
      .catch(error => {
        console.error('User profile update error:', error);
      });
  }

  return (
    <div className='healthAnalyticsSection'>
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