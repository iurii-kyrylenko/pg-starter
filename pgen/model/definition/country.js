/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Country', {
        code: {
            type: DataTypes.CHAR(3),
            field: 'code',
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT,
            field: 'name',
            allowNull: false
        },
        continent: {
            type: DataTypes.TEXT,
            field: 'continent',
            allowNull: false
        },
        region: {
            type: DataTypes.TEXT,
            field: 'region',
            allowNull: false
        },
        surfacearea: {
            type: DataTypes.FLOAT(24),
            field: 'surfacearea',
            allowNull: false
        },
        indepyear: {
            type: DataTypes.INTEGER,
            field: 'indepyear',
            allowNull: true
        },
        population: {
            type: DataTypes.INTEGER,
            field: 'population',
            allowNull: false
        },
        lifeexpectancy: {
            type: DataTypes.FLOAT(24),
            field: 'lifeexpectancy',
            allowNull: true
        },
        gnp: {
            type: DataTypes.DECIMAL(10, 2),
            field: 'gnp',
            allowNull: true
        },
        gnpold: {
            type: DataTypes.DECIMAL(10, 2),
            field: 'gnpold',
            allowNull: true
        },
        localname: {
            type: DataTypes.TEXT,
            field: 'localname',
            allowNull: false
        },
        governmentform: {
            type: DataTypes.TEXT,
            field: 'governmentform',
            allowNull: false
        },
        headofstate: {
            type: DataTypes.TEXT,
            field: 'headofstate',
            allowNull: true
        },
        capital: {
            type: DataTypes.INTEGER,
            field: 'capital',
            allowNull: true,
            references: {
                model: 'city',
                key: 'id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
        },
        code2: {
            type: DataTypes.CHAR(2),
            field: 'code2',
            allowNull: false
        }
    }, {
        schema: 'public',
        tableName: 'country',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const model = require('../index');
    const Country = model.Country;
    const Countrylanguage = model.Countrylanguage;
    const City = model.City;

    Country.hasMany(Countrylanguage, {
        as: 'LanguageCountrycodeFkeys',
        foreignKey: 'countrycode',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Country.belongsTo(City, {
        as: 'RelatedCapital',
        foreignKey: 'capital',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
