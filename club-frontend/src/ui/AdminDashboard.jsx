import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../AppState.jsx';
import TrainerApplicationSection from './trainer_ui/TrainerApplicationSection.jsx';
import EquipmentSection from './EquipmentSection.jsx';

export default function AdminDashboard() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const user = state.user;

  return (
    <>
      <TrainerApplicationSection/>
      <EquipmentSection/>
    </>
  );
}