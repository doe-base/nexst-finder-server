const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service:'yahoo',
    secure: false,
    auth: {
       user: process.env.SERVICE_EMAIL_NAME,
       pass: process.env.SERVICE_EMAIL_PASSWORD
    }
})



  module.exports = transporter