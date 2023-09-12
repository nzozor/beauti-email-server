const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const cors = require("cors");
const hbs = require('nodemailer-express-handlebars');
const path = require('path');


// Middleware to parse JSON in request body
app.use(express.json());
app.use(cors());

// Set up the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // Replace with your email service
  auth: {
    user: "nzozor@gmail.com", // Replace with your email address
    pass: "yychmggtftmkjubv", // Replace with your email password
  },
});

// RESTful API route for sending emails
app.post("/send-email", (req, res) => {
  const { to, subject, text, number, firstTimeCustomer, funnel } = req.body.data;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve('./'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./'),
  };
  transporter.use('compile', hbs(handlebarOptions))

  const mailOptions = {
    from: "nzozor@gmail.com",
    to: 'info@beautiskinclinic.com',
    subject,
    template : 'email',
    context:{
      text: text,
      email: to,
      customerStatus: firstTimeCustomer,
      phoneNumber: number,
      funnel: funnel,
    }
  };

  const mailOptionsToCustomer = {
    from: "nzozor@gmail.com",
    to,
    subject: 'Consultation Booking Confirmation',
    template : 'emailToCustomer',
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent:", info.response);
      res.json({ message: "Email sent successfully" });
    }
  });

  transporter.sendMail(mailOptionsToCustomer, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent:", info.response);
      res.json({ message: "Email sent successfully" });
    }
  });
});

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
