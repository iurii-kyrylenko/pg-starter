const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
const db = {};

const match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

const sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect:  'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    // logging: false,
    logging: console.log,
    dialectOptions: {
      ssl: true
    },
    operatorsAliases: false,
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    const modelName = file.slice(0, -3);
    db[modelName] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
