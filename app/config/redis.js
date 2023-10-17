require('dotenv').config();

module.exports = {
    URL : `redis://${process.env.HOSTREDIS}:${process.env.PORTREDIS}`,
};
