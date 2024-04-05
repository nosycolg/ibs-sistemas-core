const { db } = require('../../database');
async function main() {
    for (let i = 0; i < 10; i++) {
        const person = await db.People.create({
            name: `Cristhian Felipe da Silva ${i}`,
            gender: 'MALE',
            dateOfBirth: '2002-01-21',
            maritalStatus: 'DIVORCED',
        });

        for (let i = 0; i < 10; i++) {
            const address = await db.Address.create({
                cep: '06622-200',
                street: `Rua São Bernardo ${i}`,
                streetNumber: 420,
                district: 'Parque Santa Tereza',
                city: 'Barueri',
                state: 'SP',
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
