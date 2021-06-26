const bcrypt = require('bcrypt-nodejs');
//const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const User = require('../models/user');
const ActiveSession = require('../models/activeSession');
//const { smtpConf } = require('../config/config');
const sendEmail = require('../utils/sendEmail')

exports.getProfile = async (req, res, next) => {
    try {
        const { user } = req;
        const userProfile = User.findOne({ _id: user.userId })
        res.json({
            success: true,
            user
        })
    } catch (err) {
        throw err;
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        //if (err) throw err;

        if (!user) {
            return res.json({ success: false, msg: 'Wrong credentials' });
        }

        if (!user.verified) {
            return res.json({ success: false, msg: 'Account is not confirmed' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 86400, // 1 week
                });

                const query = { userId: user._id, token: 'JWT ' + token };
                ActiveSession.create(query, (err, cd) => {
                    user.password = null;
                    user.__v = null;
                    return res.json({
                        success: true,
                        token: 'JWT ' + token,
                        user,
                    });
                });
            } else {
                return res.json({ success: false, msg: 'Wrong credentials' });
            }
        });
    } catch (err) {
        throw err
    }
}

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email: email })
        if (user) {
            res.json({ success: false, msg: 'Email already exists' });
        } else if (password.length < 6) {
            // eslint-disable-next-line max-len
            res.json({ success: false, msg: 'Password must be at least 6 characters long' });
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, null, (err, hash) => {
                    if (err) throw err;
                    const query = {
                        name: name, email: email,
                        password: hash
                    };
                    User.create(query, async (err, user) => {
                        if (err) throw err;


                        if (process.env.DEMO != 'yes') {

                            await sendEmail({
                                email: email,
                                subject: "Confirm your account",
                                html: '<h1>Hey,</h1><br><p>Confirm your new account </p><p><a href="' + 'http://localhost:3000/auth/confirm-email/' + user._id + '">"' + 'http://localhost:3000/auth/confirm-email/' + user._id + '"</a></p>'
                            })

                            res.json({ success: true, msg: 'The user was succesfully registered' });
                        }

                        else res.json({ success: true, userID: user._id, msg: 'The user was succesfully registered' });
                    });
                });
            });
        }

    } catch (err) {
        throw err
    }
}


exports.logout = async (req, res, next) => {
    try {
        const { token } = req;
        await ActiveSession.deleteMany({ token: token })
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
        //throw err
    }

}