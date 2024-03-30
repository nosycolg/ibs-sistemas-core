const { Sequelize } = require('sequelize');
const PeopleModel = require('./models/people');
const UserModel = require('./models/user');
const logger = require('./services/logs.service');
const AddressModel = require('./models/address');

const sequelize = new Sequelize('IBSSISTEMAS', 'cristhian', 'cristhian', {
    host: 'localhost',
    dialect: 'mysql',
});

const People = PeopleModel(sequelize);
const User = UserModel(sequelize);
const Address = AddressModel(sequelize);

const db = {
    User: User,
    People: People,
    Address: Address,
    Sequelize: sequelize,
};

db.Address.belongsTo(db.People, {
    constraint: true,
    onDelete: 'cascade'
});

db.People.hasMany(db.Address, {
    constraint: true,
});

db.Address.sequelize.sync({ alter: true, logging: false }).then(() => {
    console.log(logger.available('All tables have been synchronized.'));
});

module.exports = { db };
