const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'lqmqba@gmail.com',
            pass: 'nodeMailerTest',
        },
    });

    let mailOptions = {
        from: "lqmqba@gmail.com",
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

module.exports = sendEmail;