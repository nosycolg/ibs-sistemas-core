const { DataTypes } = require('sequelize');

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize')} Sequelize
 * @returns
 */
function AddressModel(sequelize) {
    const Address = sequelize.define('address', {
        cep: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        streetNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        complement: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Address;
}

module.exports = AddressModel;
