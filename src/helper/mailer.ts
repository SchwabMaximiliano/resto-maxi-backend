import nodemailer = require('nodemailer');
import * as dotenv from 'dotenv'
dotenv.config()

export const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.MAILER_USER, // generated ethereal user
        pass: process.env.MAILER_PASS, // generated ethereal password
    },   
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(transporter);
        console.log(error);
        console.log(process.env.MAILER_HOST);
        console.log(process.env.MAILER_USER);
        console.log(process.env.MAILER_PASS);
    } else {
        console.log('listo para enviar mensajes');
    }
  });