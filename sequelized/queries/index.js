const { City, Country, CountryLanguage, sequelize } = require('../models');

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
  return response.map(({ name: country, city, countryLanguages }) => {
    const capital = city && city.get().name || '[none]';
    const languages = countryLanguages.map(({ language, percentage }) => `${language}: ${percentage}%`);
    return { country, capital, languages };
  });
};

const getCapitals = async ({ offset, limit }) => {
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

const getCountriesCities = async ({ offset, limit }) => {
  const response = await Country.findAll({
    attributes: ['name'],
    include: [{
      model: City,
      as: 'cities',
      attributes: ['name']
    }],
    offset,
    limit
  });

  // return JSON.stringify(response, null, 2);
  return response.map(({ name: country, cities }) => ({ country, cities: cities.map(c => c.name) }));
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

module.exports = {
  getCountries, getCapitals, getCountriesCities, getRaw
};
