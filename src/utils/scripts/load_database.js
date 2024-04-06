const { db } = require('../../database');
const logger = require('../../services/logs.service');
let addedUsers = 0;

async function main() {
    // for (let i = 0; i < 10; i++) {
    //     const person = await db.People.create({
    //         name: `Cristhian Felipe da Silva ${i}`,
    //         gender: 'MALE',
    //         dateOfBirth: '2002-01-21',
    //         maritalStatus: 'DIVORCED',
    //     });

    //     for (let i = 0; i < 10; i++) {
    //         const address = await db.Address.create({
    //             cep: '06622-200',
    //             street: `Rua São Bernardo ${i}`,
    //             streetNumber: 420,
    //             district: 'Parque Santa Tereza',
    //             city: 'Barueri',
    //             state: 'SP',
    //             country: 'Brazil',
    //         });

    //         await address.setPerson(person);
    //     }
    // }

    const reseted = await restartDb();
    if (reseted) {
        await createUser({
            username: 'teste',
            password: '123456',
        });

        console.log(logger.changed('Created users on script: ' + addedUsers));
        console.log(logger.success('\n\nDatabase sucessfully loaded...'));
        process.exit(0);
    }
}

/**
 *
 * @param {UserProps} param0
 * @returns
 */
async function createUser({ username, password }) {
    try {
        const passwordHashed = db.User.encryptPassword(password);

        const user = await db.User.create({
            username,
            password: passwordHashed,
        });

        addedUsers++;
        return user.id;
    } catch (err) {
        console.error(`[User Registration Error] - ${err}`);
    }
}

async function restartDb() {
    try {
        (async () => {
            try {
                await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

                const models = Object.values(db.sequelize.models);

                await Promise.all(
                    models.map(async (model) => {
                        try {
                            await model.destroy({ where: {} });
                        } catch (err) {
                            console.log(logger.alert(`Error deleting the contents of the ${model.tableName} table.\nError: ${err}`));
                        }
                    })
                );

                await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

                console.log(logger.success('Data successfully cleared.'));
            } catch (error) {
                console.error(`Error when cleaning tables ${error}`);
            }
        })();

        console.log(logger.success('Connection established!'));
        return true;
    } catch (err) {
        if (err.name === 'SequelizeDatabaseError' && err.parent && err.parent.code === 'ER_LOCK_DEADLOCK') {
            console.log(logger.warning('Deadlock detected. Trying again...'));
        } else {
            console.error(logger.alert('Error when resetting the database:', err.message));
        }
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
