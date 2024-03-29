const { db, sequelize } = require('../../database');
async function main() {
    await sequelize.sync({ force: true });
    for (let i = 0; i < 10; i++) {
        await db.People.create({
            name: `Teste ${i}`,
            gender: 'Masculino',
            dateOfBirth: '21/01/2002',
            maritalStatus: 'Solteiro',
            address: 'Joinville',
        });
    }
}

main()
    .then(() => {
        console.log('Pre load database completed! \n\n');
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
