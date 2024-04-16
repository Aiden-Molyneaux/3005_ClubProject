import { useAppState } from '../../AppState.jsx';
import { differenceInYears } from 'date-fns';

export default function HealthAnalyticsSection() {
  const { state } = useAppState();
  const member = state.member;

  function calculateAge() {
    return differenceInYears(new Date(), new Date(member.birthDate));
  }

  return (
    <div className='generalSection'>
      <h3>Health Analytics</h3>
      <div className='horizontalLine'></div>
      { member &&
        <>
          <div><label>Weight: {member.weight}</label></div>
          <div><label>Height: {member.height}</label></div>
          <div><label>Age: {calculateAge()}</label></div>
          <div><label>Gender: {member.gender}</label></div>
        </>
      }
    </div>
  );
}