const bcrypt = require('bcrypt-nodejs');
//const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const User = require('../models/user');
const ActiveSession = require('../models/activeSession');
//const { smtpConf } = require('../config/config');
const sendEmail = require('../utils/sendEmail')
const crypto = require("crypto");
const FormData = require("form-data");
const fetch = require("node-fetch");

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
            return res.json({ success: false, msg: 'User not registered' });
        }

        if (!user.verified) {
            // Did change here for google/github user, trying to login.
            if (!user.password) return res.json({ success: false, msg: 'User not registered' });
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

exports.googleLogin = async (req, res) => {
    const data = req.body;

    const profile = data.profileObj;
    // console.log(profile);
    try {
        let user = await User.findOne({ email: profile.email }).catch(e => console.log(e));

        if (!user) {
            user = await googleRegister(profile);
        }
        // console.log(user);
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
                user
            });
        });
    } catch (err) {
        throw err
    }
}

exports.githubLogin = async (req, res) => {
    const { code } = req.body;
    console.log("100 ", code);
    const data = new FormData();
    data.append("client_id", process.env.CLIENT_ID);
    data.append("client_secret", process.env.CLIENT_SECRET);
    data.append("code", code);
    data.append("redirect_uri", "http://localhost:3000/auth/login");

    // Request to exchange code for an access token
    fetch(`https://github.com/login/oauth/access_token`, {
        method: "POST",
        body: data,
    })
        .then((response) => response.text())
        .then((paramsString) => {
            let params = new URLSearchParams(paramsString);
            const access_token = params.get("access_token");
            console.log("Access_token: ", access_token);
            if (!access_token) return res.json({ success: false, msg: 'User Not Found' });
            fetch(`https://api.github.com/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
                .then((response) => { console.log(response.status); return response.json(); })
                .then(async (response) => {
                    const email = response[0].email, username = response[1].email.split('@')[0].split('+')[1];
                    console.log(email, username);

                    try {
                        let user = await User.findOne({ email: email }).catch(e => console.log(e));
                        console.log(user);
                        if (!user) {
                            user = await githubRegister(email, username);
                        }

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
                                user
                            });
                        });
                    } catch (err) {
                        throw err
                    }
                })
                .catch((error) => {
                    console.log(error);
                    return res.json({ success: false, msg: 'User Not Found' });
                });

        })
        .catch((error) => {
            console.log(error);
            return res.json({ success: false, msg: 'User Not Found' });
        });
}

async function googleRegister(profile) {
    const { name, email, imageUrl } = profile;
    const query = {
        name: name,
        email: email,
        photo: imageUrl
    };
    return await User.create(query).catch(e => console.log(e));
}

async function githubRegister(email, name) {
    const query = {
        name: name,
        email: email,
    };
    return await User.create(query).catch(e => console.log(e));
}

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email: email })
        if (user && user.password) {
            // Checked if user is not registered from google/github. 
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
                                html: '<h1>Hey,</h1><br><p>Confirm your new account </p><p><a href="' + 'http://localhost:5100/api/users/confirm/' + user._id + '">"' + 'verify!' + '"</a></p>'
                            })

                            res.json({ success: true, msg: 'The user was succesfully registered' });
                        }
                        // eslint-disable-next-line max-len
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

exports.confirmMail = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await User.findOne({ _id: userId })
        if (!user) return res.json({ success: true });
        const query = { _id: userId };

        const newvalues = { $set: { verified: true } };
        await User.updateOne(query, newvalues)
        res.send("<p> Your email-id has been verified, You will be redirected to login page or <a href='http://localhost:3000/auth/login'> click here to login</a> </p> <script>setTimeout(function(){ window.location = 'http://localhost:3000/auth/login' },3000)</script>");
    } catch (err) {
        throw err
    }
}

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({
        email: email,
    });
    if (!user) return res.json({ success: false, msg: "Email not registered!" })
    //console.log(user);
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const html = `<p>Forgot your password? <br> Paste this Code on your screen and enter your New Password.<br>  If you didn't forget your password, please ignore this email!<br>   ${resetToken} <br> </p> `;

    try {
        await sendEmail({
            email: user.email,
            subject: "Your Password Reset Token {Valid for 10 min}",
            html: html,
        });

        res.json({
            success: true,
            msg: "Token sent to mail",
        });
    } catch (err) {
        user.resetPassToken = undefined;
        user.resetPassTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });

        throw err;
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const resetToken = crypto
            .createHash("sha256")
            .update(req.body.token)
            .digest("hex");

        const user = await User.findOne({
            resetPassToken: resetToken,
            resetPassTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.json({ success: false, msg: "Invalid user" });
        }

        user.password = req.body.password;
        user.resetPassToken = undefined;
        user.resetPassTokenExpires = undefined;
        await user.save();
        res.json({ success: true, msg: "Password reset successfully" })
    } catch (err) {
        throw err;
    }
}