const db = require("../models");

const getAllTotalSurvey = async () => {
   let response;
   let query = `SELECT u.fullname as nama, SUM(value) AS totalvalue
                FROM surveys s
                LEFT JOIN unnest(s.values) AS value  ON true 
                LEFT JOIN users u ON s."userId" = u.id 
                GROUP BY u.fullname;`;

   await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT }).then(totalSurvey => {
         response = totalSurvey.map(nilai => ({nama : nilai.nama, totalNilai :  nilai.totalvalue}));
   }, error => {
         console.error(error) 
         throw error
   });

   return response;
}

const createSurvey = async (req) => {
      let query = `INSERT INTO surveys ("values","createdAt","updatedAt","userId") 
                   VALUES ('${req.values}', LOCALTIMESTAMP, LOCALTIMESTAMP,'${req.userId}');`;
   
      await db.sequelize.query(query, {type: db.sequelize.QueryTypes.INSERT}).then(function(result){
            console.log("succes");
      }, error => {
            console.error(error) 
            throw error
      });
}

module.exports = {
    getAllTotalSurvey,
    createSurvey,
}

