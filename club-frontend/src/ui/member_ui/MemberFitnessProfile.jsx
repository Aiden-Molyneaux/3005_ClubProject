import HealthAnalyticsSection from './HealthAnalyticsSection.jsx';
import MemberProfileManager from './MemberProfileManager.jsx';
import FitnessGoalSection from './FitnessGoalSection.jsx';
import ExerciseRoutineSection from './ExerciseRoutineSection.jsx';
import ProfileManager from '../ProfileManager.jsx';

export default function MemberFitnessProfile() {
  return (
    <div>
      <div className='memberProfileSection'>
        <HealthAnalyticsSection/>
        <MemberProfileManager/>
        <ProfileManager/>
      </div>

      <div className='memberProfileSection'>
        <FitnessGoalSection/>
        <ExerciseRoutineSection/>
      </div>  
    </div>
  );
}