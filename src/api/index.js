const serverless = require('serverless-http');
const app = require('../src/app');
const connectdb = require('../config/database');

let conn = null;

module.exports = async (req, res) => {
    if (!conn) {
        conn = connectdb().then(() => console.log("Database connected on Vercel!"));
    }

    await conn; // Ensure the DB is connected before handling requests

    const handler = serverless(app);
    return handler(req, res);
};
