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
        addresses: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                isValidAddress(value) {
                    if (!Array.isArray(value)) {
                        throw new Error('O campo addresses deve ser um array!');
                    }

                    for (const address of value) {
                        const keys = Object.keys(address);
                        const requiredKeys = ['cep', 'street', 'city', 'state', 'country'];

                        for (const key of keys) {
                            if (!requiredKeys.includes(key)) {
                                throw new Error(`A chave '${key}' não é permitida em um endereço`);
                            }
                        }
                    }
                },
            },
        },
    });

    return People;
}

module.exports = PeopleModel;