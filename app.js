"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const PORT = process.env.PORT;
const SMTP_SERVER_INFO = process.env.SMTP_SERVER;
const AUTH_EMAIL_CREDENTIALS = process.env.AUTH_EMAIL;
const AUTH_PASSWORD_CREDENTIALS = process.env.AUTH_PASSWORD;
const SMTP_SSL_PORT = process.env.SSL_PORT;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const transporter = nodemailer.createTransport({
    host: SMTP_SERVER_INFO,
    port: SMTP_SSL_PORT,
    secure: true,
    auth: {
        user: AUTH_EMAIL_CREDENTIALS,
        pass: AUTH_PASSWORD_CREDENTIALS
    }
});
app.get('/', (req, res) => {
    res.send('This is email-sender!')
});

app.post('/', (req, res) => {
    const {
        email,
        name,
        message
    } = req.body;

    const mailOptions = {
        from: `${name} ${email}`,
        to: AUTH_EMAIL_CREDENTIALS,
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

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});