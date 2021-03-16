const fs = require('fs');
const path = require('path');

const sequelize = require('./sequelize');

const db = {
    sequelize: sequelize,
};

// load all the models
fs
    .readdirSync(path.join(__dirname, 'models'))
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, 'models', file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
