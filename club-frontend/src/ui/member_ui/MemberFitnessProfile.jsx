import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../AppState.jsx';
import HealthAnalyticsSection from './HealthAnalyticsSection.jsx';
import FitnessGoalSection from './FitnessGoalSection.jsx';
import ExerciseRoutineSection from './ExerciseRoutineSection.jsx';

export default function MemberFitnessProfile() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const user = state.user;
  const member = state.member;

  return (
    <>
      <HealthAnalyticsSection/>
      <FitnessGoalSection/>
      <ExerciseRoutineSection/>
    </>
  );
}