const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SERVICE_EMAIL_HOST,
    port: 465,
    service: process.env.SERVICE_EMAIL_SERVICE,
    secure: false,
    auth: {
       user: process.env.SERVICE_EMAIL_NAME,
       pass: process.env.SERVICE_EMAIL_PASSWORD
    }
})



  module.exports = transporter