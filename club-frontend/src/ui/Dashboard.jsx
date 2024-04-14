import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../AppState.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import MemberDashboard from './member_ui/MemberDashboard.jsx';
import TrainerDashboard from './trainer_ui/TrainerDashboard.jsx';

export default function Dashboard() {
  const navigate = useNavigate();

  const { state, dispatch } = useAppState();
  const user = state.user;
  const role = user.role;

  useEffect(() => {
    if(!user) {
      navigate('/auth/login');
    } else if (user.role === 'none') {
      navigate('/registration');
    }
  }, []);

  function logout() {
    dispatch({ type: 'logout', payload: {} });
    navigate('/auth/login');
  } 

  return (
    <>
      <div className='dashboardLogoutBanner bottomMargin'>
        <h3>Hi {user.firstName}, welcome to your {user.role} dashboard!</h3>
        <button onClick={() => logout()}>Logout?</button>
      </div>
      { (role === 'admin') && <AdminDashboard/> }
      { (role === 'member') && <MemberDashboard/> }
      { (role === 'trainer') && <TrainerDashboard/> }
    </>
  );
}