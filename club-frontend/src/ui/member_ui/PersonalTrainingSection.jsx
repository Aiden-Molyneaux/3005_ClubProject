import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppState } from '../../AppState.jsx';
import { getMemberTrainingSessions } from '../../util/helper.js';
import { getTrainersWithAvailability } from '../../util/helper.js';
import { updateTrainerAvailability } from '../../util/helper.js';

export default function PersonalTrainingSection() {
  const { state } = useAppState();
  const member = state.member;

  const [sessions, setSessions] = useState([]);
  const [trainerAvailabilities, setTrainerAvailabilities] = useState({});
  const [availableTimeslots, setAvailableTimeslots] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [formData, setFormData] = useState({
    date: '', 
    trainerId: '',
    timeslotId: ''
  });

  useEffect(() => {
    if (member && member.id) {
      getMemberTrainingSessions(member.id).then((sessions) => setSessions(sessions));
    }
  }, [member, reloadFlag]);

  useEffect(() => {
    getTrainersWithAvailability().then((trainers) => {
      setTrainerAvailabilities(trainers);
    });
  }, [reloadFlag]);

  useEffect(() => {
    if (trainerAvailabilities && Object.keys(trainerAvailabilities).length > 0) {
      const initialTrainerId = Object.keys(trainerAvailabilities)[0];
      const initialDate = dates[1] + 'T04:00:00.000Z';

      const timeslots = getAvailableTimeslots(initialTrainerId, initialDate);
      let initialTimeslotId = 0;
      if (timeslots.length > 0) {
        setAvailableTimeslots(timeslots);
        initialTimeslotId = timeslots[0].availabilityId;
      } else {
        setAvailableTimeslots([]);
      }
  
      setFormData({
        date: initialDate,
        trainerId: initialTrainerId,
        timeslotId: initialTimeslotId,
      });
    }
  }, [trainerAvailabilities]);

  useEffect(() => {
    const timeslots = getAvailableTimeslots(formData.trainerId, formData.date);
    if (timeslots.length > 0) {
      setAvailableTimeslots(timeslots);
      setFormData({...formData, timeslotId: timeslots[0].availabilityId});
    } else {
      setAvailableTimeslots([]);
    }
  }, [formData.trainerId, formData.date, reloadFlag]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name] : event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    
    submitSession().then((session) => {
      submitAttendee(session.id);
      updateTrainerAvailability(formData.timeslotId, 'booked').then(() => {
        setReloadFlag(!reloadFlag);
      });
    });
  }

  function submitSession() {
    return axios.post('http://localhost:3000/training_sessions', {
      trainerId: formData.trainerId,
      roomId: 1,
      availabilityId: formData.timeslotId
    })
      .then(response => {
        console.group('Training session created successfully:', response.data);
        return response.data.training_session;
      })
      .catch(error => {
        console.error('Training session creation error:', error);
      });
  }

  function submitAttendee(trainingSessionId) {
    axios.post('http://localhost:3000/attendees', {
      trainingSessionId: trainingSessionId,
      memberId: member.id
    })
      .then(response => {
        console.group('Attendee created successfully:', response.data);
      })
      .catch(error => {
        console.error('Attendee creation error:', error);
      });
  }

  function cancelSession(trainingSessionId, availabilityId) {
    deleteTrainingSession(trainingSessionId).then(() => {
      updateTrainerAvailability(availabilityId, 'available').then(() => {
        setReloadFlag(!reloadFlag);
      });
    });
  }

  function deleteTrainingSession(trainingSessionId) {
    return axios.delete(`http://localhost:3000/training_sessions/${trainingSessionId}`)
      .then(response => {
        console.group('Training session deleted successfully:', response.data);
        return true;
      })
      .catch(error => {
        console.error('Training session delete error:', error);
      });
  }

  function getDates() {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    }
    return dates;
  }

  const dates = getDates();

  function getAvailableTimeslots(trainerId, date) {
    const trainerAvailability = trainerAvailabilities[trainerId];
    if (trainerAvailability && trainerAvailability.availabilities) {
      const dateAvailability = trainerAvailability.availabilities[date];
      if (dateAvailability) {
        return dateAvailability
          .filter((timeslot) => timeslot.status === 'available')
          .sort((a, b) => a.availabilityId - b.availabilityId) 
          || [];
      }
    }
    return [];
  }

  return (
    <div className='memberSchedule'>
      <div className='healthAnalyticsSection topMargin'>
        <h3>Personal Training Sessions</h3>
        <div className='horizontalLine'></div>
        { sessions.length === 0
          ? <h4>You currently have no sessions booked</h4>
          : <div className='goalSection'> { sessions && sessions.map((session, index) => (
            <div key={index} > 
              <h4 className='underline'>Session #{index+1}</h4>
              <div><label>Trainer: {session.trainer.firstName + ' ' + session.trainer.lastName}</label></div>
              <div><label>Date: {session.date.split('T')[0]}</label></div>
              <div><label>Start time: {session.startTime}</label></div>
              <div><label>End time: {session.endTime}</label></div>
              <button className='topMargin' onClick={() => cancelSession(session.id, session.availabilityId)}>Cancel</button>
            </div>
          ))}
          </div>
        }
      </div>

      <div className='healthAnalyticsSection topMargin'>
        <h3>Book a Personal Training Session</h3>
        <div className='horizontalLine'></div>
        { trainerAvailabilities &&
          <form className='scheduler' onSubmit={handleSubmit}>
            <div>
              <label>Date:</label>
              <select name="date" value={formData.date} onChange={handleChange}>
                { Object.keys(dates).map(date => (
                  <option key={date} value={dates[date] + 'T04:00:00.000Z'}>{dates[date]}</option>
                ))}
              </select>
            </div>
                
            <div>
              <label>Trainer:</label>
              <select name="trainerId" value={formData.trainerId} onChange={handleChange}>
                { Object.values(trainerAvailabilities).map((entry, index) => (
                  <option key={index} value={entry.trainer.trainerId}>{entry.trainer.firstName + ' ' + entry.trainer.lastName}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Timeslot:</label>
              <select name="timeslotId" value={formData.timeslotId} onChange={handleChange}>
                { availableTimeslots.length > 0 
                  ? availableTimeslots.map((timeslot, index) => (
                    <option key={index} value={timeslot.availabilityId}>{timeslot.startTime + ' to ' + timeslot.endTime}</option>
                  ))
                  : <option key={0} value={''}>--</option>
                }
              </select>
            </div>

            <button className='topMargin' type="submit">Book</button>
          </form>
        }
      </div>
    </div>
  );
}