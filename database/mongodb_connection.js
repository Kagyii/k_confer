//npm packages
const mongoClient = require('mongodb').MongoClient;
const env = require('dotenv')

env.config()
 
// Database Name
const dbName = 'k_confer_mongodb';

// Connection URL
const url = process.env.MONGODB_CONNECTION_STRING;

let mongodb;

module.exports.connect = () => {

    return new Promise((resolve, reject) => {
        mongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {

            if(err){
                return reject(err);
            }

            mongodb = db.db(dbName);
            return resolve(mongodb)
        });
    })

}

module.exports.get = () =>{
    return mongodb;
}




