module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('city', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    countrycode: DataTypes.STRING,
    district: DataTypes.STRING,
    population: DataTypes.INTEGER
  }, {
    timestamps: false,
    tableName: 'city'
  });

  City.associate = ({ Country }) => {
    City.hasOne(Country, {
      foreignKey: 'capital'
    });
  };
  
  return City;
};
