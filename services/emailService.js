const nodemailer = require('nodemailer');


async function sendMail({ from, to, subject, text, html }) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
          }
    });

    //For sending an mail
    let info = await transporter.sendMail({                                               // here the sendMail() is method for nodemailer
        from:`File Transfer<${from}>`,  
        to,                             // here key is coming from files.js in sendmail() function and vaalue is coming from this file sendMail()                           
        subject,
        text,
        html
    })                                  

}

module.exports = sendMail;