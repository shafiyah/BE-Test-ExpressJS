
module.exports = (sequelize, Sequelize) => {
    const CyberAttack = sequelize.define(
      "CyberAttack",
      {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sourceCountry : {
           type: Sequelize.STRING,
           allowNull: true, 
        },
        destinationCountry : {
            type: Sequelize.STRING,
            //allowNull: false, 
        },
        type : {
            type: Sequelize.STRING,
            allowNull: true, 
        },
        millisecond: {
            type: Sequelize.INTEGER,
            allowNull: true, 
        },
        weight: {
            type: Sequelize.INTEGER,
            allowNull: true, 
        },
        attackTime : {
            type:"TIMESTAMP",
            allowNull: true, 
        },
      },
      { 
        timestamps: false,
        tableName: 'cyberattack',
        modelName: 'CyberAttack',
      }
    );
    
    return CyberAttack;
  };
  