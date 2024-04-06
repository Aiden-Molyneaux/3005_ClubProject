import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../AppState.jsx';
import { differenceInYears } from 'date-fns';

export default function HealthAnalyticsSection() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const user = state.user;
  const member = state.member;

  function calculateAge() {
    return differenceInYears(new Date(), new Date(member.birth_date));
  }

  return (
    <>
      <h2>Health Analytics</h2>
      { member &&
        <div>
          <h4>Weight: {member.weight}</h4>
          <h4>Age: {calculateAge()}</h4>
          <h4>Gender: {member.gender}</h4>
        </div>
      }
    </>
  );
}