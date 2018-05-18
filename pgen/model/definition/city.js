/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('City', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT,
            field: 'name',
            allowNull: false
        },
        countrycode: {
            type: DataTypes.CHAR(3),
            field: 'countrycode',
            allowNull: false
        },
        district: {
            type: DataTypes.TEXT,
            field: 'district',
            allowNull: false
        },
        population: {
            type: DataTypes.INTEGER,
            field: 'population',
            allowNull: false
        }
    }, {
        schema: 'public',
        tableName: 'city',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const model = require('../index');
    const City = model.City;
    const Country = model.Country;

    City.hasMany(Country, {
        as: 'CountryCapitalFkeys',
        foreignKey: 'capital',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
