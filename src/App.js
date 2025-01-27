import React, { useState } from 'react';
import './App.css';

function App() {
  // [Variable, function to update the state] = initial state
  const [buyerName, setBuyerName] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerCivilStatus, setBuyerCivilStatus] = useState('');

  const [sellerName, setSellerName] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [dateOfSale, setDateOfSale] = useState('');

  const [makeSeries, setMakeSeries] = useState('');
  const [model, setModel] = useState('');
  const [motorNo, setMotorNo] = useState('');
  const [crNo, setCrNo] = useState('');
  const [type, setType] = useState('');
  const [plateNo, setPlateNo] = useState('');
  const [chassisNo, setChassisNo] = useState('');
  const [fileNo, setFileNo] = useState('');

  const [witness1Name, setWitness1Name] = useState('');
  const [witness2Name, setWitness2Name] = useState('');

  const [buyerEmail] = useState('');
  const [recipientEmail] = useState('');

  // const [buyerSignature, setBuyerSignature] = useState(null);
  // const [sellerSignature, setSellerSignature] = useState(null);

  //Google Auth
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  //Function to submit (react passes the event object automatically)
  const handleSubmit = (e) => {
    // Prevent the default form reload upon submission
    e.preventDefault();
    //Object holding all the values from the form
    const data = {
      buyerName,
      buyerAddress,
      buyerCivilStatus,
      sellerName,
      sellerAddress,
      salePrice,
      dateOfSale,
      makeSeries,
      model,
      motorNo,
      crNo,
      type,
      plateNo,
      chassisNo,
      fileNo,
      witness1Name,
      witness2Name,
      // buyerSignature,
      // sellerSignature,
    };
    //Calls the function to generate the PDF with the data passed
    generatePDF(data);
  };

  

  const generatePDF = (data) => {
    //Importing the jsPDF library so we can create PDFs in JS
    const { jsPDF } = require('jspdf');
    //Create a new document
    const doc = new jsPDF();

    doc.text('Deed of Sale', 10, 10);
    doc.text(`Buyer Name: ${data.buyerName}`, 10, 20);
    doc.text(`Buyer Address: ${data.buyerAddress}`, 10, 30);
    doc.text(`Buyer Civil Status: ${data.buyerCivilStatus}`, 10, 40);

    doc.text(`Seller Name: ${data.sellerName}`, 10, 50);
    doc.text(`Seller Address: ${data.sellerAddress}`, 10, 60);
    doc.text(`Sale Price: ${data.salePrice}`, 10, 70);
    doc.text(`Date of Sale: ${data.dateOfSale}`, 10, 80);

    doc.text('Motor Vehicle Info:', 10, 90);
    doc.text(`Make/Series: ${data.makeSeries}`, 10, 100);
    doc.text(`Model: ${data.model}`, 10, 110);
    doc.text(`Motor No: ${data.motorNo}`, 10, 120);
    doc.text(`C.R. No: ${data.crNo}`, 10, 130);
    doc.text(`Type: ${data.type}`, 10, 140);
    doc.text(`Plate No.: ${data.plateNo}`, 10, 150);
    doc.text(`Chassis No: ${data.chassisNo}`, 10, 160);
    doc.text(`File No: ${data.fileNo}`, 10, 170);

    doc.text(`Witness 1: ${data.witness1Name}`, 10, 180);
    doc.text(`Witness 2: ${data.witness2Name}`, 10, 190);

    // For signatures, we will mention the file names since PDFs can't directly store images in this simple format
    // doc.text(`Buyer Signature: ${data.buyerSignature ? 'Uploaded' : 'Not Provided'}`, 10, 200);
    // doc.text(`Seller Signature: ${data.sellerSignature ? 'Uploaded' : 'Not Provided'}`, 10, 210);

    // Save the PDF
    doc.save('deed_of_sale.pdf');
  };
  
  
  const sendEmail = (data) => {
    if (!buyerEmail) {
        alert('Please provide your email to send the document.');
        return;
    }

    // Ask for the recipient email
    const recipientEmail = prompt("Please enter the recipient's email:");

    if (!recipientEmail) {
        alert('Recipient email is required.');
        return;
    }

    fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            senderEmail: buyerEmail, // User's email from login
            recipientEmail: recipientEmail, // Recipient's email entered
            formData: data,
        }),
    })
    .then((response) => response.json())
    .then(() => {
        alert('Email sent successfully!');
    })
    .catch((error) => {
        alert('Error sending email: ' + error.message);
    });
};

// In the handleSubmit method, change the action to call the `sendEmail` method
const handleActionChange = () => {
  // Check if the user is logged in (authenticated via Google)
  const user = sessionStorage.getItem("user"); // Check if user is stored in session (after Google login)

  if (!user) {
      // If the user isn't logged in, trigger Google login
      handleLogin();
  } else {
      // If the user is logged in, proceed with asking for the recipient email
      sendEmail({
          buyerName,
          buyerAddress,
          buyerCivilStatus,
          sellerName,
          sellerAddress,
          salePrice,
          dateOfSale,
          makeSeries,
          model,
          motorNo,
          crNo,
          type,
          plateNo,
          chassisNo,
          fileNo,
          witness1Name,
          witness2Name,
          buyerEmail,
          recipientEmail,
      });
  }
};




  return (
    <div className="App">
      <h1>Deed of Sale</h1>
      <form onSubmit={handleSubmit}>
        {/* Buyer Details */}
        <h3>Buyer Details</h3>
        <label>Buyer Name:
          <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
        </label><br />
        <label>Buyer Address:
          <input type="text" value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} />
        </label><br />
        <label>Buyer Civil Status:
          <input type="text" value={buyerCivilStatus} onChange={(e) => setBuyerCivilStatus(e.target.value)} />
        </label><br />

        {/* Seller Details */}
        <h3>Seller Details</h3>
        <label>Seller Name:
          <input type="text" value={sellerName} onChange={(e) => setSellerName(e.target.value)} />
        </label><br />
        <label>Seller Address:
          <input type="text" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} />
        </label><br />
        <label>Sale Price (₱):
  <input
    type="number"
    value={salePrice}
    onChange={(e) => setSalePrice(e.target.value)}
    step="0.01"
    min="0"
    placeholder="Enter amount in ₱"
  />
</label><br />

        <label>Date of Sale:
          <input type="date" value={dateOfSale} onChange={(e) => setDateOfSale(e.target.value)} />
        </label><br />

        {/* Vehicle Info */}
        <h3>Motor Vehicle Info</h3>
        <label>Make/Series:
          <input type="text" value={makeSeries} onChange={(e) => setMakeSeries(e.target.value)} />
        </label><br />
        <label>Model:
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} />
        </label><br />
        <label>Motor No:
          <input type="text" value={motorNo} onChange={(e) => setMotorNo(e.target.value)} />
        </label><br />
        <label>C.R. No:
          <input type="text" value={crNo} onChange={(e) => setCrNo(e.target.value)} />
        </label><br />
        <label>Type:
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
        </label><br />
        <label>Plate No.:
          <input type="text" value={plateNo} onChange={(e) => setPlateNo(e.target.value)} />
        </label><br />
        <label>Chassis No:
          <input type="text" value={chassisNo} onChange={(e) => setChassisNo(e.target.value)} />
        </label><br />
        <label>File No:
          <input type="text" value={fileNo} onChange={(e) => setFileNo(e.target.value)} />
        </label><br />

        {/* Witnesses */}
        <h3>Witnesses</h3>
        <label>Witness Name:
          <input type="text" value={witness1Name} onChange={(e) => setWitness1Name(e.target.value)} />
        </label><br />
        <label>Witness Name:
          <input type="text" value={witness2Name} onChange={(e) => setWitness2Name(e.target.value)} />
        </label><br />

        {/* Signatures
        <h3>Signatures</h3>
        <label>Upload Buyer Signature:
          <input type="file" onChange={(e) => setBuyerSignature(e.target.files[0])} />
        </label><br />
        <label>Upload Seller Signature:
          <input type="file" onChange={(e) => setSellerSignature(e.target.files[0])} />
        </label><br /> */}

<br/>
        
        <div>
        <button type="submit">Generate Deed of Sale PDF</button>
        <br/>
        <button type="button" onClick={() => handleActionChange('send')}>Send via Email</button>
        </div>
        
      </form>
    </div>
  );
}

export default App;
