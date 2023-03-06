const { MongoClient } = require('mongodb');

async function connect() {
    try{
        const client = await MongoClient.connect('mongodb://127.0.0.1:27017/school');
        const db = client.db();
        console.log('Connected to DB');
        return db;
    } catch (err) {
        console.log('DB Connection Script');
        console.log(err);
    }
}

module.exports = { connect } ;
