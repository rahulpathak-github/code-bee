dbPasswordDev = 'mongodb+srv://rahul:1234@cluster0.u4xph.mongodb.net/hackathon?retryWrites=true&w=majority';

// for PRODUCTION
// const MONGO_USERNAME = 'sammy';
// const MONGO_PASSWORD = 'your_password';
// const MONGO_HOSTNAME = '127.0.0.1';
// const MONGO_PORT = '27017';
// const MONGO_DB = 'sharkinfo';

// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

module.exports = {
  mongoURI: dbPasswordDev,
  secret: 'yourSecretKey',
};
