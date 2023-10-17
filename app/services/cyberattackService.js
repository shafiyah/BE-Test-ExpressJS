const axios = require('axios');
const redisService = require('./redisSevice');
const db = require('../models');

const fetchDataFromAPI = async () => {
  try {
    const cachedData = await redisService.getCachedData('apiData');
    if (cachedData) {
      console.log('Berhasil mengambil data dari cache');
      return cachedData;
    }else{
        const response = await axios.get('https://livethreatmap.radware.com/api/map/attacks?limit=10');
        const data = response.data[0];
        redisService.cacheData('apiData', data);
        console.log('Berhasil mengambil data dari api');
        return data;
    }
  } catch (error) {
    throw error;
  }
};

const saveToDatabase = async (datas) => {
  
    for (let data of datas ){
        try {
            await db.cyberattack.create({ sourceCountry: data.sourceCountry, destinationCountry: data.destinationCountry,
                    millisecond: data.millisecond, type: data.type, weight:data.weight, attackTime: data.attackTime });       
         } catch (error) {
           throw error;
         }
    }  
};

const getTotalAttack = async () => {
    let response;
    let query = `SELECT "type" as "label", count("sourceCountry") as "total" 
                 FROM cyberattack
                 WHERE "sourceCountry" is not null and "destinationCountry" is not null
                 GROUP by "type"; `;
 
    await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT }).then(totalAttack => {
          response = totalAttack.map(attack  => ({label : attack.label, totalNilai :  attack.total}));
    }, error => {
          console.error(error);
          throw error;
    });
 
    return response;
 }

module.exports = {
  fetchDataFromAPI,
  saveToDatabase,
  getTotalAttack,
};
