import { DataTypes, Sequelize } from 'sequelize';

export default function PeopleModel(sequelize: Sequelize) {
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
      type: DataTypes.STRING
    }
  });

  return People;
}