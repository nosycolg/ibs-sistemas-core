import app from './routes/routes';
import { sequelize } from './database';

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    app.listen(9999);

    console.log('Conexão estabelecida!');
  } catch (err) {
    console.error('Ocorreu um erro no banco de dados: ', err);
  }
}

startServer();