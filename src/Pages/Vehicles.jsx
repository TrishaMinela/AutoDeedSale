import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../App';
import './vehicle.css'; 



function Vehicle() {
  // State to manage the form inputs and the list of vehicle records
  const [vehicleName, setVehicleName] = useState('');
  const [priceBought, setPriceBought] = useState('');
  const [dateBought, setDateBought] = useState('');
  const [priceSold, setPriceSold] = useState('');
  const [dateSold, setDateSold] = useState('');

  const [vehicleRecords, setVehicleRecords] = useState([]);

  // Fetch existing vehicle records from Firestore when the component mounts
  const fetchVehicleRecords = async () => {
    const querySnapshot = await getDocs(collection(db, 'vehicles'));
    const records = querySnapshot.docs.map((doc) => (doc.data()));
    setVehicleRecords(records);
  };

  //Handle the insertion of a new vehicle record
  const handleInsert = async () => {
    const newRecord = {
        vehicleName,
        priceBought: Number(priceBought),
        dateBought: new Date(dateBought),
        priceSold: Number(priceSold),
        dateSold: new Date(dateSold),
      };

    // Add the new record to Firestore
    await addDoc(collection(db, 'vehicles'), newRecord);

    // Reset form inputs
    setVehicleName('');
    setPriceBought('');
    setDateBought('');
    setPriceSold('');
    setDateSold('');

    // Fetch updated records from Firestore
    fetchVehicleRecords();
  };

    // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return timestamp ? timestamp.toDate().toLocaleDateString() : '';
  };

    // Fetch vehicle records when the component mounts
  useEffect(() => {
    fetchVehicleRecords();
  }, []);

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
          <label htmlFor="dateBought">Date Bought</label>
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
          <label htmlFor="dateSold">Date Sold</label>
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
                  <strong>Vehicle Name:</strong> {record.vehicleName} - 
                  <strong>Price Bought:</strong> {record.priceBought} - 
                  <strong>Date Bought:</strong> {formatDate(record.dateBought)} - 
                  <strong>Price Sold:</strong> {record.priceSold} - 
                  <strong>Date Sold:</strong> {formatDate(record.dateSold)}
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
