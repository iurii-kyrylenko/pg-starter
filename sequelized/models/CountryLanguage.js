module.exports = (sequelize, DataTypes) => {
  const CountryLanguage = sequelize.define('countryLanguage', {
    language: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    isofficial: DataTypes.BOOLEAN,
    percentage: DataTypes.FLOAT,
  }, {
    timestamps: false,
    tableName: 'countrylanguage'
  });

  return CountryLanguage;
};
