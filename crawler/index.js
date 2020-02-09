require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = process.env.URL;

// Database Name
const dbName = "myproject";

// Use connect method to connect to the server
MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});
