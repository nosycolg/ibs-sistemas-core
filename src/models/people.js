const { DataTypes } = require('sequelize');

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
        address: {
            type: DataTypes.STRING,
        },
    });

    return People;
}

module.exports = PeopleModel;