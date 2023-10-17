const config = require("../config/redis");
const redis = require('redis');
const urlredis = config.URL;
const client = redis.createClient({ url: urlredis });

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

function cacheData(key, data) {
  client.setEx(key, 180, JSON.stringify(data)); // Set data to expire in 180 seconds (3 minutes)
}

const getCachedData =  (key) => {
  console.log("masuk get cache ");
  return new Promise((resolve, reject) => {
       client.get(key).then((data => {
          //console.log(data);
          resolve(data ? JSON.parse(data) : null);
       })).catch((error => {
          console.log(error);
          reject(new Error("fail"),error);
       }));
  });
};

module.exports = {
  cacheData,
  getCachedData,
};