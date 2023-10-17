
const jwtUtils = require('../utils/jwt');
const db = require('../models');

const authenticateUser = async (req,res) => {

let token;
const { username, password } = req.body;

   await validateUserLogin(username,password).then((author => {
    console.log(author);
        token = jwtUtils.generateToken({ username : author.username, role : author.role });
   })).catch((error => {
        console.log(error);
        throw new Error('Authentication failed');
   }));
    
    return token;
};

const validateUserLogin  = async (username, password) => {
    let response;
    let query = `SELECT DISTINCT  "username" , "password", "role"
                 FROM authors
                 WHERE "username" = :username and password =:password
                 LIMIT 1 `;
 
    await db.sequelize.query(query, { replacements: { username: username, password: password }, type: db.sequelize.QueryTypes.SELECT }).then(authors => {
          response = authors.map(author  => ({username : author.username, password :  author.password, role: author.role}));
    }, error => {
          console.error(error);
          throw error;
    });
    return response[0];
}


const validateUserAccesEndpoint  = async (requestUrl) => {
   console.log(requestUrl)
    let response;
    let query = `SELECT unnest(roles) AS roles
                 FROM endpontacces
                 WHERE path = :pathurl `;

    await db.sequelize.query(query, { replacements: { pathurl : requestUrl }, type: db.sequelize.QueryTypes.SELECT }).then(roles => {
          response = roles.map(item => item.roles.toLowerCase());
    }, error => {
          console.error(error);
          throw error;
    });

    return response;
}

module.exports = {
  authenticateUser,
  validateUserLogin,
  validateUserAccesEndpoint,
};