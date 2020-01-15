const sequelize = require('../lib/pgbaseConnector');
const Sequelize = require('sequelize');

const  favorite = sequelize.define('favorite', {
    user_id: {
        type: Sequelize.INTEGER,
    },

    nickname_gamer: {
        type: Sequelize.STRING(700)
    }

});

module.exports = favorite;