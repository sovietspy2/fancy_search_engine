require("dotenv").config();
//const MongoClient = require("mongodb").MongoClient;
const hosts = require("./hosts");
const log4js = require("log4js");
const logger = log4js.getLogger();
const fetch = require("node-fetch");
var uniq = require('lodash.uniq');
var stringSimilarity = require('string-similarity');
var urllib = require('url');

logger.level = "debug";
logger.info("Config loaded ready to roll!");

// Connection URL
const url = process.env.URL;

// Use connect method to connect to the server
var urlRegex = /(\b(https?|ftp|file||http):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

const randomTextWithUrls = `hello there https://www.test.com meg mas text http://www.google.com`;

async function main() {

  //const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  //const db = client.db('search');
  //const collection = db.collection("result");

  //await collection.insertOne({ test: "test" });
  //logger.debug("Inserted");

  const urls = [process.env.START_URL];

  let allHops = 0;
  const history = [];

  while (urls.length > 0) {
    allHops++;
    logger.info("URLS COUNT", urls.length, "all hops: ", allHops);
    const url = urls.shift();
    history.push(url);

    logger.debug(url);
    try {
      const response = await fetch(url);
      const text = await response.text();

      const page = JSON.stringify(text);
      const newUrls = page.match(urlRegex);

      const cleanUrls = newUrls.map(uri => {
        var q = urllib.parse(uri, true);
        const workingUrl = q.protocol + "//" + q.host;
        return workingUrl;
      });

      const uniqueNewUrls = uniq(cleanUrls);
      uniqueNewUrls.map(uri => {

        const valid = urls.every(item => {
          const similarity = stringSimilarity.compareTwoStrings(item, uri);
          return similarity < 0.7;
        });

        const inHistory = history.find(u => u === uri);

        if (valid && !inHistory) {
          urls.push(uri);
          logger.debug("added", uri);
        }
      })
      //logger.debug("added ", newUrls.length)
    } catch (e) {
      logger.error(e)
    }


  }
}

async function addKeyword(db, key, link) {
  return db
    .collection("keyword")
    .insertOne({ key, url: link, createDate: new Date() });
}

function validUrl(url) {
  return /^http|^https/.test(url);
}

async function wait(millis) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, millis);
  });
}

async function getNextKeyword(db) {
  return db
    .collection("keyword")
    .findOneAndUpdate({ status: "READY" }, { $set: { status: "PROCESSING" } });
}




main();
