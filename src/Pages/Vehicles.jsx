import React, { useState } from 'react';
import './vehicle.css'; 

function Vehicle() {
  // State to manage the form inputs and the list of vehicle records
  const [vehicleName, setVehicleName] = useState('');
  const [priceBought, setPriceBought] = useState('');
  const [dateBought, setDateBought] = useState('');
  const [priceSold, setPriceSold] = useState('');
  const [dateSold, setDateSold] = useState('');

  const [vehicleRecords, setVehicleRecords] = useState([]);

  // Handle the insertion of a new vehicle record
  const handleInsert = () => {
    const newRecord = {
      vehicleName,
      priceBought,
      dateBought,
      priceSold,
      dateSold,
    };

    // Add the new record to the existing list of vehicle records
    setVehicleRecords([...vehicleRecords, newRecord]);

    // Reset form inputs
    setVehicleName('');
    setPriceBought('');
    setDateBought('');
    setPriceSold('');
    setDateSold('');
  };

  return (
    <div className="vehicle-container">
      <div className="left-vehicle-content">
        <h2>These are your</h2>
        <h1>VEHICLE RECORDS</h1>
        <h3>Insert a new record</h3>

        <div className="input-form">
          <input
            type="text"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            placeholder="Vehicle Name"
          />
          <input
            type="number"
            value={priceBought}
            onChange={(e) => setPriceBought(e.target.value)}
            placeholder="Price Bought"
          />
          <input
            type="date"
            value={dateBought}
            onChange={(e) => setDateBought(e.target.value)}
          />
          <input
            type="number"
            value={priceSold}
            onChange={(e) => setPriceSold(e.target.value)}
            placeholder="Price Sold"
          />
          <input
            type="date"
            value={dateSold}
            onChange={(e) => setDateSold(e.target.value)}
          />

          <button onClick={handleInsert}>Insert</button>
        </div>
      </div>

      <div className="right-vehicle-content">
        <h3>Vehicle Records</h3>
        <div className="records-list">
          {vehicleRecords.length > 0 ? (
            vehicleRecords.map((record, index) => (
              <div key={index} className="record-item">
                <p> <strong>Vehicle Name:</strong> {record.vehicleName} - <strong>Price Bought:</strong> {record.priceBought} - <strong>Date Bought:</strong> {record.dateBought} - <strong>Price Sold:</strong> {record.priceSold} - <strong>Date Sold:</strong> {record.dateSold}</p>
              </div>
            ))
          ) : (
            <p>No records yet. Please insert a new vehicle record.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vehicle;
