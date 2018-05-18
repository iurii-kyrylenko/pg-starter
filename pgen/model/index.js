/* eslint global-require: "off" */
const model = {};
let initialized = false;

/**
 * Initializes sequelize models and their relations.
 * @param   {Object} sequelize  - Sequelize instance.
 * @returns {Object}            - Sequelize models.
 */
function init(sequelize) {
    delete module.exports.init; // Destroy itself to prevent repeated calls and clash with a model named 'init'.
    initialized = true;
    // Import model files and assign them to `model` object.
    model.City = sequelize.import('./definition/city.js');
    model.Country = sequelize.import('./definition/country.js');
    model.Countrylanguage = sequelize.import('./definition/countrylanguage.js');

    // All models are initialized. Now connect them with relations.
    require('./definition/city.js').initRelations();
    require('./definition/country.js').initRelations();
    require('./definition/countrylanguage.js').initRelations();
    return model;
}

// Note: While using this module, DO NOT FORGET FIRST CALL model.init(sequelize). Otherwise you get undefined.
module.exports = model;
module.exports.init = init;
module.exports.isInitialized = initialized;
