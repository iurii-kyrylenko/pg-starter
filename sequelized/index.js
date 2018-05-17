require('dotenv').config();
const Sequelize = require('sequelize');

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

const City = sequelize.define(
  'city',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
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

const Country = sequelize.define(
  'country',
  {
    code: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: Sequelize.STRING,
    continent: Sequelize.STRING,
    region: Sequelize.STRING,
    population: Sequelize.INTEGER
  },
  {
    timestamps: false,
    tableName: 'country'
  }
);

Country.belongsTo(City, {
  foreignKey: 'capital'
});

City.hasOne(Country, {
  foreignKey: 'capital'
});

const getCountries = async ({ offset, limit }) => {
  const response = await Country.findAll({
    attributes: ['name'],
    include: [{
      model: City,
      attributes: ['name'],
      // required: true
    }],
    offset,
    limit
  });

  return response.map(({ name: country, city }) => {
    const capital = city && city.get().name || '---'
    return { country, capital };
  });
};

const getCities = async ({ offset, limit }) => {
  const response = await City.findAll({
    attributes: ['name'],
    include: [{
      model: Country,
      attributes: ['name'],
      required: true
    }],
    offset,
    limit
  });

  // return JSON.stringify(response, null, 2);
  return response.map(({ name: capital, country: { name: country } }) => ({ capital, country }));
};

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    console.log(await getCountries({ offset: 230, limit: 5 }));
    console.log(await getCities({ offset: 100, limit: 5 }));
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

main();
