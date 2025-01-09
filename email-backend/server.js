require('dotenv').config();
//Authenticating requests 
const passport = require('passport');
//Google OAuth 2.0 authentication strategy for Passport
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//Makes it simple to interact with Gmail using OAuth
const { google } = require('googleapis');
//Express middleware for session handling
const session = require('express-session');
// Simplifies routing, middleware, and other server-side logic
const express = require('express');
//Library used to send emails from node.js apps
const nodemailer = require('nodemailer');
//Access data from the request body of the HTTP Request
const bodyParser = require('body-parser');
//Middleware to enable CORS
const cors = require('cors');
//Creates an instance of the express server
const app = express();
//Generate PDF data
const PDFDocument = require('pdfkit');
const fs = require('fs');


// Middlewares
app.use(cors()); // Allows cross-origin requests
app.use(bodyParser.json()); // Parses JSON data from requests

app.use(session({
    secret: process.env.SESSION_SECRET || 'fluffy',  
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Route to initiate Google login
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // Request access to user's Google profile and email
}));

// Callback route after Google login
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }), // On failure, redirect to the homepage
    (req, res) => {
        // Store the accessToken and refreshToken in the session
        req.session.accessToken = req.user.accessToken;
        req.session.refreshToken = req.user.refreshToken;
        
        // Redirect to the same page where the "Send to Email" button will appear
        res.redirect('/');
    }
);

// Handle email form submission
app.post('/send-email', async (req, res) => {
    if (req.user) {
        const { buyerEmail } = req.body;

        // Check if the access token exists in the session
        if (!req.session.accessToken) {
            return res.status(400).send('<h1>User is not authenticated. Please log in with Google first.</h1>');
        }

        // Create a new OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID, 
            process.env.GOOGLE_CLIENT_SECRET
        );
        
        // Set the credentials using the stored access token and refresh token
        oauth2Client.setCredentials({
            access_token: req.session.accessToken,
            refresh_token: req.session.refreshToken,
        });

        // Create a Gmail API instance
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Generate the PDF
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(buffers);
            const pdfData = pdfBuffer.toString('base64');

            // Prepare the email message
            const emailMessage = `
                From: "your-email@gmail.com"
                To: ${buyerEmail}
                Subject: Deed of Sale Document
                Content-Type: multipart/mixed; boundary="boundary_string"

                --boundary_string
                Content-Type: text/plain; charset="UTF-8"
                Content-Transfer-Encoding: 7bit

                Please find the attached deed of sale document.

                --boundary_string
                Content-Type: application/pdf; name="deed_of_sale.pdf"
                Content-Transfer-Encoding: base64
                Content-Disposition: attachment; filename="deed_of_sale.pdf"

                ${pdfData}
                --boundary_string--
            `;

            // Send the email
            try {
                const message = Buffer.from(emailMessage).toString('base64');
                await gmail.users.messages.send({
                    userId: 'me',
                    requestBody: {
                        raw: message,
                    },
                });
                res.send('<h1>Email sent successfully!</h1>');
            } catch (error) {
                console.error('Error sending email:', error);
                res.send('<h1>Failed to send email.</h1>');
            }
        });

        doc.text('This is the Deed of Sale document.');
        doc.end();
    } else {
        res.redirect('/');
    }
});


app.get('/', (req, res) => {
    if (req.user) {
        // If the user is authenticated, show the "Send to Email" button
        res.send(`
            <h1>Welcome ${req.user.displayName}</h1>
            <p>You are logged in. Please enter the buyer's email and click the button to send the document.</p>
            <form action="/send-email" method="POST">
                <label>Buyer Email:</label>
                <input type="email" name="buyerEmail" required />
                <button type="submit">Send to Email</button>
            </form>
        `);
    } else {
        // If not authenticated, show the "Login with Google" button
        res.send(`
            <h1>Welcome to the Deed of Sale App</h1>
            <p>Please log in to send the document.</p>
            <a href="/auth/google"><button>Login with Google</button></a>
        `);
    }
});

//Tells Passport how to authenticate users using Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log('User profile:', profile);
    // Attach tokens to the user object
    const user = {
        profile,
        accessToken,
        refreshToken
    };
    //Log the user's profile and pass the profile to the done function
    return done(null, user);
}));

// Serialize(save) and deserialize(retrieve) user for session handling
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});



// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
