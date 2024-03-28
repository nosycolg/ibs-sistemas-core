import { DataTypes, Sequelize } from 'sequelize';

export default function AdressModel(sequelize: Sequelize) {
  const Adress = sequelize.define('adress', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Adress;
}