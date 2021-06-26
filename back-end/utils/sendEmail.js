const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    let transport;
    if (process.env.NODE_ENV === "production") {
        transport = nodemailer.createTransport({
            service: "SendGrid",
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD,
            },
        });
    } else {
        transport = nodemailer.createTransport({
            host: 'smtp.googlemail.com',
            port: 465,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    const mailOptions = {
        from: "<rahulmpathak1@gmail.com>",
        to: options.email,
        subject: options.subject,
        //text: options.message,
        html: options.html,
    };

    await transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

module.exports = sendEmail;