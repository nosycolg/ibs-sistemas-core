const { DataTypes } = require('sequelize');

function SessionModel(sequelize) {
    const Session = sequelize.define('Session',
        {
            sessionId: {
                type: DataTypes.UUID,
                defaultValue: sequelize.Sequelize.UUIDV4,
                primaryKey: true,
            },
            jwt: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            expiration_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            tableName: 'session',
            associate: function (models) {
                Session.belongsTo(models.User, {
                    onDelete: 'cascade',
                });
            },
        }
    );

    return Session;
}

module.exports = SessionModel;
