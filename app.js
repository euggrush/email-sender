const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
        user: 'your-email-address',
        pass: 'your-email-password'
    }
});

app.post('/send-email', (req, res) => {
    const {
        email,
        name,
        message
    } = req.body;

    const mailOptions = {
        from: '"Your Name" <your-email-address>',
        to: 'recipient@example.com',
        subject: 'New message from contact form',
        text: `From: ${name} (${email})\n\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({
                message: 'Error sending email'
            });
        } else {
            console.log('Email sent: ' + info.response);
            res.send({
                message: 'Email sent successfully'
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});