import { useState, useEffect } from 'react';
import { useAppState } from '../AppState.jsx';
import { getEquipment } from '../util/helper.js';

export default function EquipmentSection() {
  const { state, dispatch } = useAppState();

  const user = state.user;
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    getEquipment().then((equipment) => {
      if (equipment) {
        setEquipment(equipment);
      }
    })
  }, [])

  function orderMaintenance() {
    
  }

  return (
    <>
      <h3>Equipment:</h3>
      <table>
        <thead>
          <tr>
            <th>Equipment ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Maintenance Status</th>
            <th>Order Maintenance</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(equipment => (
            <tr key={equipment.id}>
              <td>{equipment.id}</td>
              <td>{equipment.name}</td>
              <td>{equipment.type}</td>
              <td>{equipment.maintenance_status}</td>
              <td>
                <button onClick={() => orderMaintenance()}>Yes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>

  );
}