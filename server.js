/*
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve home.html at the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Quote form handler
app.post('/quote', async (req, res) => {
    const { name, email, phone, details } = req.body;
    if (!name || !email || !phone || !details) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Compose email
    const msg = {
        to: process.env.TO_EMAIL,
        from: process.env.FROM_EMAIL,
        subject: `New Quote Request from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDetails: ${details}`,
        html: `<p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Project Details:</strong><br/>${details}</p>`
    };

    try {
        await sgMail.send(msg);
        res.json({ success: true, message: 'Quote request sent!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// Health check
app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
*/

// new version using nodemailer
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Handle quote form
app.post('/quote', async (req, res) => {
  const { name, email, phone, details } = req.body;
  if (!name || !email || !phone || !details) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.TO_EMAIL,
    subject: `New Quote Request from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDetails: ${details}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Quote request sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
