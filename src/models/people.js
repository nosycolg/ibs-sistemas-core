const { DataTypes } = require('sequelize');

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize')} Sequelize
 * @returns
 */
function PeopleModel(sequelize) {
    const People = sequelize.define('people', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        maritalStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return People;
}

module.exports = PeopleModel;
