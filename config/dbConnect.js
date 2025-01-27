const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URI;
const dbName = 'eventsDB';

let db;

const dbConnect = async () => {
    if (db) {
        console.log('Reusing existing MongoDB connection');
        return db;
    }
    try {
        const client = await MongoClient.connect(url);
        console.log('Connected to MongoDB');
        db = client.db(dbName);

        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

module.exports = dbConnect;
