require('dotenv').config();
const { sequelize } = require('./models');
const { getCountries, getCapitals, getCountriesCities, getRaw } = require('./queries');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    console.log('---------------------');
    console.log(await getCountries({ offset: 220, limit: 15 }));
    console.log('---------------------');
    console.log(await getCapitals({ offset: 100, limit: 15 }));
    console.log('---------------------');
    console.log(await getCountriesCities({ offset: 225, limit: 10 }));
    console.log('---------------------');
    console.log(await getRaw({ limit: 5 }));
    console.log('---------------------');
} catch (err) {
    console.error('Something went wrong:', err);
  }
}

main();
