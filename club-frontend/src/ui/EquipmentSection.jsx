import { useState, useEffect } from 'react';
import { getEquipment, updateEquipmentStatus } from '../util/helper.js';

export default function EquipmentSection() {
  const [equipment, setEquipment] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    getEquipment().then((equipment) => {
      if (equipment) {
        setEquipment(equipment.sort((a, b) => a.id - b.id));
      }
    });
  }, [reloadFlag]);

  function orderMaintenance(equipmentId) {
    updateEquipmentStatus(equipmentId).then(() => {
      setReloadFlag(!reloadFlag);
    });
  }

  return (
    <div className='generalSection topMargin'>
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
              <td>{equipment.maintenanceStatus}</td>
              { equipment.maintenanceStatus === 'Yes' && 
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