require('dotenv').config();

const {DB_HOST, SECRET_KEY, SG_API_KEY} = process.env;

module.exports = { DB_HOST, SECRET_KEY, SG_API_KEY };