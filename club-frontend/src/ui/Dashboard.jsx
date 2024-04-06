import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../AppState.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import MemberDashboard from './member_ui/MemberDashboard.jsx';
import TrainerDashboard from './trainer_ui/TrainerDashboard.jsx';

export default function Dashboard() {
  const { state } = useAppState();
  const navigate = useNavigate();

  const user = state.user;
  const role = user.role;

  useEffect(() => {
    if(!user) {
      navigate('/auth/login');
    } else if (user.role == 'none') {
      navigate('/registration');
    }
  }, []);

  return (
    <>
      <h1>Hi {user.first_name}, welcome to your {user.role} dashboard!</h1>
      { (role == 'admin') && 
        <AdminDashboard/>
      }

      { (role == 'member') &&
        <MemberDashboard/>
      }

      { (role == 'trainer') &&
        <TrainerDashboard/>
      }
    </>
  );
}