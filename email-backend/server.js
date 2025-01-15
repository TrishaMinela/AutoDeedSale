require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('googleapis');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fluffy',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'build')));

// Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        profile,
        accessToken,
        refreshToken,
      };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
// For any other request, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.send'],
    accessType: 'offline',
    prompt: 'consent',
    successRedirect: 'http://localhost:3000', 
    failureRedirect: '/login', 
  })
);

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Store the user session after successful login
    req.session.user = req.user;
    res.redirect('/');
  });

// PDF and Email Sending Route
// PDF and Email Sending Route
app.post('/send-email', async (req, res) => {
    if (!req.session.passport?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
  
    const { buyerEmail, recipientEmail, formData } = req.body;
  
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
  
      const { accessToken, refreshToken } = req.session.passport.user;
      oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
      // Generate PDF
      const pdfDoc = new PDFDocument();
      const pdfBuffers = [];
      pdfDoc.on('data', (chunk) => pdfBuffers.push(chunk));
      pdfDoc.on('end', async () => {
        const pdfBuffer = Buffer.concat(pdfBuffers).toString('base64');
  
        const emailMessage = `
          Content-Type: multipart/mixed; boundary="boundary_string"
    
          --boundary_string
          Content-Type: text/plain; charset="UTF-8"
          Content-Transfer-Encoding: 7bit
    
          Please find the attached deed of sale document.
    
          --boundary_string
          Content-Type: application/pdf; name="deed_of_sale.pdf"
          Content-Transfer-Encoding: base64
          Content-Disposition: attachment; filename="deed_of_sale.pdf"
    
          ${pdfBuffer}
          --boundary_string--
        `;
  
        await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw: Buffer.from(emailMessage).toString('base64') },
        });
  
        res.status(200).json({ message: 'Email sent successfully!' });
      });
  
      // Add content to PDF
      pdfDoc.text('Deed of Sale').moveDown();
      Object.entries(formData).forEach(([key, value]) => pdfDoc.text(`${key}: ${value}`));
      pdfDoc.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });
  
  
  // Serve Frontend
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/build', 'index.html')));
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));