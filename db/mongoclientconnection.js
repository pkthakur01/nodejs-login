var dbconfig= require('../config/dbconfig')
const MongoClient = require('mongodb').MongoClient;

//Dev
//let url= dbconfig.connString+dbconfig.username+":"+dbconfig.password+"@"+dbconfig.host+":"+dbconfig.port+"/"+dbconfig.dbName+"?"+dbconfig.connParams;
let url = "mongodb://localhost:27017/reglogin";
const assert = require('assert');
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
  if(err) {
       console.log('Error occurred while connecting to MongoDB...\n',err);
  }

  console.log("Connected successfully to Database mongo client: "+ url);
  db = client.db(dbconfig.dbName);
}); 

module.exports = {
  getDb: function () {
    return db;
  },
  url
};
