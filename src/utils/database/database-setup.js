const { Sequelize } = require('sequelize');
const config = require('src/config/config');

const sequelize = new Sequelize(config.databaseUrl, {
    dialect: 'postgres',
    logging: config.env === 'development' ? console.log : false,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = { sequelize };
