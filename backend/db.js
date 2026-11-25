require('dotenv').config();

const mariaddb = require('mariadb');

const pool = mariaddb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});