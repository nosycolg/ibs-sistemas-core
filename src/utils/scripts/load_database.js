const { db } = require('../../database');
async function main() {
    for (let i = 0; i < 10; i++) {
        const person = await db.People.create({
            name: `Cristhian Felipe da Silva ${i}`,
            gender: 'Masculino',
            dateOfBirth: '21/01/2002',
            maritalStatus: 'Solteiro',
        });

        for (let i = 0; i < 10; i++) {
            const address = await db.Address.create({
                cep: '54767-160',
                street: `Rua São Bernardo ${i}`,
                city: 'Barueri',
                state: 'São Paulo',
                country: 'Brazil',
            });

            await address.setPerson(person);
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
