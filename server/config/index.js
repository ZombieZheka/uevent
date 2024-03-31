// server/models/index.js

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const configs = {};

fs.readdirSync(__dirname)
.filter(file => {
    return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js'
        );
    })
.forEach(file => {
    const config = require(path.join(__dirname, file));
    const name = file.replace('.js', '');
    configs[name] = config;
});

module.exports = configs;
