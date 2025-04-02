import React from 'react';
import { useState, useEffect } from 'react';

function DeedofSale() {
  // [Variable, function to update the state] = initial state
  const [buyerName, setBuyerName] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerCivilStatus, setBuyerCivilStatus] = useState('');

  const sellerName = 'Sherwin Sumiran';
  const sellerAddress = '9172 Purok V Victoria Laguna';

  const [salePrice, setSalePrice] = useState('');
  
  const currentDate = new Date().toISOString().split('T')[0];
  const [dateOfSale, setDateOfSale] = useState(currentDate);

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
  const [authenticated, setAuthenticated] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  // const [buyerSignature, setBuyerSignature] = useState(null);
  // const [sellerSignature, setSellerSignature] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated (you can store in localStorage or sessionStorage)
    if (localStorage.getItem('authToken')) {
      setAuthenticated(true);
    }
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    sendEmail({
      buyerEmail,
      recipientEmail,
    });
  };

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
  // Importing the jsPDF library so we can create PDFs in JS
  const { jsPDF } = require('jspdf');
  // Create a new document
  const doc = new jsPDF();

  // Set font to Times New Roman
  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  // Set margins (padding around content)
  const margin = 20; // Left and right margin
  const topMargin = 30; // Top margin for title and first line of text
  const lineHeight = 6; // Spacing between lines
  let yPosition = topMargin; // Start after the margin

  // Title (Centered)
  doc.setFontSize(16);
  const title = 'Deed of Sale of a Motor Vehicle';
  const titleWidth = doc.getTextWidth(title);
  const xTitle = (doc.internal.pageSize.width - titleWidth) / 2;
  doc.text(title, xTitle, yPosition);
  yPosition += lineHeight * 2;

  // Content - Main body text (formatted as paragraphs)
  doc.setFontSize(12);
  const content = [
    `I, ${data.sellerName}, of legal age, Filipino citizen, and a resident of ${data.sellerAddress}, Philippines, herein referred to as the VENDOR, for and in consideration of the amount of ${data.salePrice} PESOS, Philippines currency and receipt of which is hereby acknowledged from ${data.buyerName}, of legal age, Filipino citizen, with residence and postal address, ${data.buyerAddress}, Philippines herein referred to as the VENDEE, hereby SELL, TRANSFER and CONVEY, and by these presents have SOLD, TRANSFERRED AND CONVEYED unto said VENDEE that motor vehicle herein described as follows:`,

    `Make/Series: ${data.makeSeries}`,
    `Type: ${data.type}`,
    `Model: ${data.model}`,
    `Plate No.: ${data.plateNo}`,
    `Motor No.: ${data.motorNo}`,
    `Chassis No.: ${data.chassisNo}`,
    `C.R. No.: ${data.crNo}`,
    `File No.: ${data.fileNo}`,

    `I hereby warrant that the above-described motor vehicle is free from any lien or encumbrance except that which appears in the Certificate of Registration, if any, and that I will defend the title and rights of the VENDEE from any claims of whatever kind or nature from third persons.`,

    `In witness whereof, we have hereunto affixed our signature this ${data.dateOfSale} day of ${data.month} in Laguna, Philippines.`,

    'Signed in the presence of:',

  ];

  // Add content with paragraph-like formatting and text wrapping
    const lineWidth = doc.internal.pageSize.width - 2 * margin; // Calculating width available for text
  content.forEach((text, index) => {
    // First paragraph - custom line height
    if (index === 0) {
      doc.text(text, margin, yPosition, { maxWidth: lineWidth });
      yPosition += lineHeight * 5.5;  // Extra spacing for first paragraph
    }
    // 9th, 10th, and 11th paragraphs - custom line height
    else if (index === 9 || index === 10) {
      doc.text(text, margin, yPosition, { maxWidth: lineWidth });
      yPosition += lineHeight * 3;  // Extra spacing for these paragraphs
    }
    // Other paragraphs - standard line height
    else {
      doc.text(text, margin, yPosition, { maxWidth: lineWidth });
      yPosition += lineHeight * 1.5;  // Standard spacing for other paragraphs
    }
  });

  // Signature lines
  doc.text('Witness 1: ______________________', margin, yPosition);
  yPosition += lineHeight;
  doc.text('Witness 2: ______________________', margin, yPosition);

  yPosition += lineHeight * 3;
  doc.text('Vendor: ______________________', margin, yPosition);
  yPosition += lineHeight;
  doc.text('Vendee: ______________________', margin, yPosition);

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
      <form onSubmit={handleSubmit}>
        {/* Buyer Details */}
        <h3>Buyer Details</h3>
        <input
          type="text"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          placeholder="Enter Buyer Name"
        /><br />
        <input
          type="text"
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
          placeholder="Enter Buyer Address"
        /><br />
        <input
          type="text"
          value={buyerCivilStatus}
          onChange={(e) => setBuyerCivilStatus(e.target.value)}
          placeholder="Enter Buyer Civil Status"
        /><br />

        <input
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          step="0.01"
          min="0"
          placeholder="Enter Sale Price in ₱"
        /><br />

        {/* Vehicle Info */}
        <input
          type="text"
          value={makeSeries}
          onChange={(e) => setMakeSeries(e.target.value)}
          placeholder="Enter Make/Series"
        /><br />
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Enter Model"
        /><br />
        <input
          type="text"
          value={motorNo}
          onChange={(e) => setMotorNo(e.target.value)}
          placeholder="Enter Motor No"
        /><br />
        <input
          type="text"
          value={crNo}
          onChange={(e) => setCrNo(e.target.value)}
          placeholder="Enter C.R. No"
        /><br />
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Enter Type"
        /><br />
        <input
          type="text"
          value={plateNo}
          onChange={(e) => setPlateNo(e.target.value)}
          placeholder="Enter Plate No"
        /><br />
        <input
          type="text"
          value={chassisNo}
          onChange={(e) => setChassisNo(e.target.value)}
          placeholder="Enter Chassis No"
        /><br />
        <input
          type="text"
          value={fileNo}
          onChange={(e) => setFileNo(e.target.value)}
          placeholder="Enter File No"
        /><br />

        {/* Witness Details
        <h3>Witnesses</h3>
        <input
          type="text"
          value={witness1Name}
          onChange={(e) => setWitness1Name(e.target.value)}
          placeholder="Enter Witness 1 Name"
        /><br />
        <input
          type="text"
          value={witness2Name}
          onChange={(e) => setWitness2Name(e.target.value)}
          placeholder="Enter Witness 2 Name"
        /><br /> */}

        <h3>Sale Date</h3>
        <input
          type="date"
          value={dateOfSale}
          onChange={(e) => setDateOfSale(e.target.value)}
        /><br />

        {/* Submit Buttons */}
        <button type="submit">Generate PDF</button>
        <button type="button" onClick={handleActionChange}>Send via Email</button>
      </form>
    </div>
  );
}





export default DeedofSale;
