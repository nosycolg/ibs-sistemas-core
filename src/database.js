const { Sequelize } = require('sequelize');
const PeopleModel = require('./models/people');
const UserModel = require('./models/user');
const SessionModel = require('./models/session');

const sequelize = new Sequelize('ibsSistemas', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

const People = PeopleModel(sequelize);
const User = UserModel(sequelize);
const Session = SessionModel(sequelize);

const db = {
    People: People,
    User: User,
    Session: Session
};

module.exports = { sequelize, db };
