require('dotenv').config();
const Sequelize = require('sequelize');

const match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

const sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect:  'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: false,
    dialectOptions: {
      ssl: true
    },
    operatorsAliases: false,
});

const City = sequelize.define(
  'city',
  {
    name: Sequelize.STRING,
    countrycode: Sequelize.STRING,
    district: Sequelize.STRING,
    population: Sequelize.INTEGER
  },
  {
    timestamps: false,
    tableName: 'city'
  }
);

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const response = await City.findAll({ limit: 10 });
    const result = response.map(city => city.get());
    console.log(result);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

main();
