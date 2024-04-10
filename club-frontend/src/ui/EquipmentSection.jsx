import axios from 'axios';
import { useState, useEffect } from 'react';
import { getEquipment } from '../util/helper.js';

export default function EquipmentSection() {
  const [equipment, setEquipment] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    getEquipment().then((equipment) => {
      if (equipment) {
        setEquipment(equipment.sort((a, b) => a.id - b.id));
      }
    })
  }, [reloadFlag])

  function orderMaintenance(equipment_id) {
    axios.patch(`http://localhost:3000/equipment/${equipment_id}`, {
      maintenance_status: 'No'
    })
    .then(response => {
      console.log('Equipment successfully updated:', response);
      setReloadFlag(!reloadFlag);
    })
    .catch(error => {
      console.error('Equipment update error:', error);
    })
  }

  return (
    <div className='healthAnalyticsSection topMargin'>
      <h3>Equipment</h3>
      <div className='horizontalLine'></div>
      <table className='topMargin'>
        <thead>
          <tr>
            <th>Equipment ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Needs Maintenance</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(equipment => (
            <tr key={equipment.id}>
              <td>{equipment.id}</td>
              <td>{equipment.name}</td>
              <td>{equipment.type}</td>
              <td>{equipment.maintenance_status}</td>
              {equipment.maintenance_status == 'Yes' && 
                <td>
                  <button onClick={() => orderMaintenance(equipment.id)}>Order maintenance</button>
                </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}