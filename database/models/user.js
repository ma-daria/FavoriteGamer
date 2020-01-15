const sequelize = require('../lib/pgbaseConnector');
const Sequelize = require('sequelize');

const  user = sequelize.define('user', {
    name: {
        type: Sequelize.STRING(700)
    },

    surname: {
        type: Sequelize.STRING(700)
    },

    path_avatar: {
        type: Sequelize.STRING(700)
    },

    email: {
        type: Sequelize.STRING(700),
        unique: true
    },

    password: {
        type: Sequelize.STRING(700)
    },

});

module.exports = user;