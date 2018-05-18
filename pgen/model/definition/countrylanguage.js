/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Countrylanguage', {
        countrycode: {
            type: DataTypes.CHAR(3),
            field: 'countrycode',
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'country',
                key: 'code'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
        },
        language: {
            type: DataTypes.TEXT,
            field: 'language',
            allowNull: false,
            primaryKey: true
        },
        isofficial: {
            type: DataTypes.BOOLEAN,
            field: 'isofficial',
            allowNull: false
        },
        percentage: {
            type: DataTypes.FLOAT(24),
            field: 'percentage',
            allowNull: false
        }
    }, {
        schema: 'public',
        tableName: 'countrylanguage',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const model = require('../index');
    const Countrylanguage = model.Countrylanguage;
    const Country = model.Country;

    Countrylanguage.belongsTo(Country, {
        as: 'RelatedCountrycode',
        foreignKey: 'countrycode',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
