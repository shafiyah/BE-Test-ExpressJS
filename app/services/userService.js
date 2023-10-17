const db = require("../models");

const updateUserStatus = async (req) => {
      let query = `UPDATE users SET  doSurvey = ${req.doSurvey} WHERE id = '${req.userId}';`;
      return await db.sequelize.query(query, {type: db.sequelize.QueryTypes.UPDATE}).catch((err) => 
      {throw err , console.log(err)});
}

module.exports = {
      updateUserStatus,
};