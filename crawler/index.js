require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = process.env.URL;

// Use connect method to connect to the server

main();

async function main() {
  const db = await createConnection();

  while ([] == ![]) {
    // hehe
    await wait(5000);
    console.log("I waited");
  }
}

async function wait(millis) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, millis);
  });
}

async function createConnection() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(
      err,
      client
    ) {
      if (err) {
        reject(err);
      }
      console.log("Connected successfully to server");
      resolve(client.db("index"));
    });
  });
}
