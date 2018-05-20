module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('country', {
    code: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    continent: DataTypes.STRING,
    region: DataTypes.STRING,
    population: DataTypes.INTEGER
  }, {
    timestamps: false,
    tableName: 'country'
  });

  Country.associate = ({ City, CountryLanguage }) => {
    Country.belongsTo(City, {
      foreignKey: 'capital'
    });
    
    Country.hasMany(City, {
      as: 'cities',
      foreignKey: 'countrycode'
    });
    
    Country.hasMany(CountryLanguage, {
      foreignKey: 'countrycode',
    });
  };
  
  return Country;
};
