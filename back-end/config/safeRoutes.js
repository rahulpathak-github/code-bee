const ActiveSession = require('../models/activeSession');
const jwt = require('jsonwebtoken')
const config = require('./keys')

const reqAuth = async (req, res, next) => {
  try {
    //console.log(req.header("Authorization"))
    const token = req.header("Authorization").replace("Bearer ", "");
    //const decoded = jwt.verify(token, config.secret);
    const user = await ActiveSession.findOne({
      // userId: decoded._id,
      token: String(token),
    });


    // ActiveSession.find({ token: token }, (err, session) => {
    // console.log(session)
    if (!user) {
      return res.json({ success: false, msg: 'User is not logged in' });
    }
    req.user = user;
    req.token = token;
    // if (session.length == 1) {
    return next();
    // } 
    // else {
    //   return res.json({ success: false, msg: 'User is not logged in' });
    // }
    // });
  } catch (err) { res.status(401).send({ error: err }); }
};

module.exports = {
  reqAuth: reqAuth,
}