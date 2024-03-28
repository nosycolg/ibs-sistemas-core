import { Sequelize } from 'sequelize';
import PeopleModel from './models/tables/People';
import AdressModel from './models/tables/Adress';

const sequelize = new Sequelize('ibsSistemas', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

const People = PeopleModel(sequelize);
const Adress = AdressModel(sequelize);

const db = {
    People: People,
    Adress: Adress
};

export { sequelize, db };
