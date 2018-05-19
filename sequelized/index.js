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

const CountryLanguage = sequelize.define(
  'countrylanguage',
  {
    language: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    isofficial: Sequelize.BOOLEAN,
    percentage: Sequelize.FLOAT,
  },
  {
    timestamps: false,
    tableName: 'countrylanguage'
  }
);

Country.belongsTo(City, {
  foreignKey: 'capital'
});

City.hasOne(Country, {
  foreignKey: 'capital'
});

Country.hasMany(CountryLanguage, {
  foreignKey: 'countrycode'
});

const getCountries = async ({ offset, limit }) => {
  const response = await Country.findAll({
    attributes: ['name', 'capital'],
    include: [
      { model: City, attributes: ['name'] },
      { model: CountryLanguage, attributes: ['language', 'percentage'] },
    ],
    offset,
    limit
  });

  // return JSON.stringify(response, null, 2);
  return response.map(({ name: country, city, countrylanguages }) => {
    const capital = city && city.get().name || '[none]';
    const languages = countrylanguages.map(({ language, percentage }) => `${language}: ${percentage}%`);
    return { country, capital, languages };
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

const getRaw = async ({ limit }) => {
  const response = await sequelize.query(
    'select language, count(countrycode) from countrylanguage group by language order by count desc limit :limit;',
    {
      replacements: { limit },
      type: sequelize.QueryTypes.SELECT
    }
  );

  return JSON.stringify(response, null, 2);
};

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    console.log('---------------------');
    console.log(await getCountries({ offset: 220, limit: 15 }));
    console.log('---------------------');
    console.log(await getCities({ offset: 100, limit: 15 }));
    console.log('---------------------');
    console.log(await getRaw({ limit: 5 }));
    console.log('---------------------');
  } catch (err) {
    console.error('Somethig went wrong:', err);
  }
};

main();
