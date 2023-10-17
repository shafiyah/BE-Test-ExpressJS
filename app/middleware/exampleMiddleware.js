const jwtUtils = require('../utils/jwt');
const authConfig = require('../config/auth');
const authorService = require('../services/authorService');

exampleMiddlewareFunction = async (req, res, next) => {
  
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwtUtils.verifyToken(token);
    const endpoint = req.url;
    const rolesAcces = await authorService.validateUserAccesEndpoint(endpoint);

    if (!rolesAcces.includes(decodedToken.user.role)){
      throw new Error('unauthorise');
    }
    next();
  } catch (error) {
    res.status(500).send({ 
      statusCode: 500, 
      message: "Unauthorized user", 
      success: false,
    });
  }
};

loginVerfication = (req, res, next) => {
  try {
    if (req.headers.authorization != ""){
        next();
    }
  } catch (error) {
    res.status(500).send({ 
      statusCode: 500, 
      message: "Login first ", 
      success: false,
    });
  }
};

const verify = {
  exampleMiddlewareFunction: exampleMiddlewareFunction,
  loginVerfication : loginVerfication
};

module.exports = verify;
