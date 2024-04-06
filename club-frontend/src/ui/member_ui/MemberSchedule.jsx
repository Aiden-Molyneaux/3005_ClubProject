import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../AppState.jsx';
import PersonalTrainingSection from './PersonalTrainingSection.jsx';

export default function MemberSchedule() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const user = state.user;
  const member = state.member;

  return (
    <>
      <PersonalTrainingSection/>
    </>
  );
}