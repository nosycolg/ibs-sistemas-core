const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

function UserModel(sequelize) {
    const User = sequelize.define('user',
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        });

    User.encryptPassword = function (password) {
        // eslint-disable-next-line no-sync
        return bcrypt.hashSync(password, 8);
    };

    User.passwordValidate = async function (password) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
        return regex.test(password);
    };

    User.prototype.authenticate = async function (requestPassword, currentPassword) {
        return await bcrypt.compare(requestPassword, currentPassword);
    };

    return User;
}

module.exports = UserModel;
