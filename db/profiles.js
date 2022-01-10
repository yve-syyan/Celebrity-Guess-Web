require('dotenv').config();
// correct credential
const profile1 = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER_ADMIN,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}

// credentials for exceptions
const profile2 = {
  host: 'hw4.cjozvl6u1wl2.us-east-2.rds.amazonaws.com',
  user: 'error_username',
  password:  'error_password', 
  database:   'game',
}

module.exports = {
  profile1, profile2,
};