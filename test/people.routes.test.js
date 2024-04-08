require('dotenv').config();
const { db } = require('../src/database');

const { expect, agent } = require('./config/app');

let res;
let personOneId;
let personTwoId;
let addressId;

describe('people test', async () => {
    before(async () => {
        res = await agent.post('/register').send({
            username: 'junior',
            password: 'Teste01!',
        });
        expect(res.statusCode).equals(200);
        expect(res.body.token).to.not.equals(null);

        res = await agent.post('/login').send({
            username: 'junior',
            password: 'Teste01!',
        });
        expect(res.statusCode).equals(200);

        res = await agent.post('/register').send({
            username: 'pleno',
            password: 'Teste01!',
        });
        expect(res.statusCode).equals(200);
        expect(res.body.token).to.not.equals(null);

        for (let i = 0; i < 5; i++) {
            const person = await db.People.create({
                name: `Júnior ${i}`,
                gender: 'MALE',
                dateOfBirth: '21-01-2023',
                maritalStatus: 'DIVORCED',
            });

            if (i === 0) {
                personOneId = person.id;
            }
        }

        for (let i = 0; i < 5; i++) {
            const person = await db.People.create({
                name: `Pleno ${i}`,
                gender: 'FEMALE',
                dateOfBirth: '21-01-2023',
                maritalStatus: 'SINGLE',
            });

            if (i === 0) {
                personTwoId = person.id;
            }

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

                if (i === 0) {
                    addressId = address.id;
                }

                await address.setPerson(person);
            }
        }
    });

    // People

    it('get all people', async () => {
        res = await agent.get('/people');
        expect(res.statusCode).equals(200);
        expect(res.body.results).to.be.an('array').with.lengthOf(10);
    });

    it('get all people with params', async () => {
        res = await agent.get('/people?limit=10&page=1&category=name&search=Junior');
        expect(res.statusCode).equals(200);
        expect(res.body.results).to.be.an('array').with.lengthOf(5);
        expect(res.body.results[0]).to.include({
            name: 'Júnior 0',
            gender: 'MALE',
            dateOfBirth: '21-01-2023',
            maritalStatus: 'DIVORCED',
        });
    });

    it('get all people with other params', async () => {
        res = await agent.get('/people?limit=10&page=1&category=gender&search=FEMALE');
        expect(res.statusCode).equals(200);
        expect(res.body.results).to.be.an('array').with.lengthOf(5);
        expect(res.body.results[0]).to.include({
            name: 'Pleno 0',
            gender: 'FEMALE',
            dateOfBirth: '21-01-2023',
            maritalStatus: 'SINGLE',
        });
    });

    it('get person by ID test', async () => {
        res = await agent.get('/person/' + personOneId);
        expect(res.statusCode).equals(200);
        expect(res.body.id).equals(personOneId);
    });

    it('get person by id with non-existent id', async () => {
        res = await agent.get('/person/-1');
        expect(res.statusCode).equals(404);
    });

    it('create person', async () => {
        res = await agent.post('/person').send({
            name: 'SENIOR',
            gender: 'MALE',
            dateOfBirth: '21-01-2023',
            maritalStatus: 'DIVORCED',
        });
        expect(res.statusCode).equals(200);

        res = await agent.get('/person/' + res.body.id);
        expect(res.statusCode).equals(200);
        expect(res.body).to.include({
            name: 'SENIOR',
            gender: 'MALE',
            dateOfBirth: '21-01-2023',
            maritalStatus: 'DIVORCED',
        });
    });

    it('update person', async () => {
        res = await agent.post('/person').send({
            name: 'SENIOR',
            gender: 'MALE',
            dateOfBirth: '21-01-2023',
            maritalStatus: 'DIVORCED',
        });
        expect(res.statusCode).equals(200);
        const senior_user = res.body;

        res = await agent.get('/person/' + senior_user.id);
        expect(res.statusCode).equals(200);
        expect(res.body).to.include({
            name: 'SENIOR',
            gender: 'MALE',
            dateOfBirth: '21-01-2023',
            maritalStatus: 'DIVORCED',
        });

        res = await agent.put('/person/' + senior_user.id).send({
            name: 'PABLO',
            gender: 'FEMALE',
            dateOfBirth: '21-01-2022',
            maritalStatus: 'SINGLE',
        });
        expect(res.statusCode).equals(200);

        res = await agent.get('/person/' + senior_user.id);
        expect(res.statusCode).equals(200);
        expect(res.body).to.include({
            name: 'PABLO',
            gender: 'FEMALE',
            dateOfBirth: '21-01-2022',
            maritalStatus: 'SINGLE',
        });
    });

    it('update non-existent person', async () => {
        res = await agent.put('/person/-1').send({
            name: 'PABLO',
            gender: 'FEMALE',
            dateOfBirth: '21-01-2022',
            maritalStatus: 'SINGLE',
        });
        expect(res.statusCode).equals(404);
    });

    it('update person without all required fields', async () => {
        res = await agent.put('/person/' + personOneId).send({
            name: 'PABLO',
            dateOfBirth: '21-01-2022',
            maritalStatus: 'SINGLE',
        });
        expect(res.statusCode).equals(400);
    });

    it('delete person', async () => {
        res = await agent.post('/person').send({
            name: 'SENIOR',
            gender: 'MALE',
            dateOfBirth: '21-01-2023',
            maritalStatus: 'DIVORCED',
        });
        expect(res.statusCode).equals(200);
        const senior_user = res.body;

        res = await agent.delete('/person/' + senior_user.id);
        expect(res.statusCode).equals(200);
    });

    it('delete non-existent person', async () => {
        res = await agent.delete('/person/-1');
        expect(res.statusCode).equals(404);
    });

    // Addresses

    it('get addresses', async () => {
        res = await agent.get(`/addresses/${personTwoId}?limit=10&page=1`);
        expect(res.statusCode).equals(200);
        expect(res.body.results[0]).to.include({
            cep: '06622-200',
            street: 'Rua São Bernardo 0',
            streetNumber: '420',
            district: 'Parque Santa Tereza',
            city: 'Barueri',
            state: 'SP',
            country: 'Brazil',
        });

        res = await agent.get(`/addresses/${personTwoId}?limit=10&page=1&category=street&search=rua`);
        expect(res.statusCode).equals(200);
        expect(res.body.results[0]).to.include({
            cep: '06622-200',
            street: 'Rua São Bernardo 0',
            streetNumber: '420',
            district: 'Parque Santa Tereza',
            city: 'Barueri',
            state: 'SP',
            country: 'Brazil',
        });
        res = await agent.get(`/addresses/${personTwoId}?limit=10&page=1&category=state&search=SC`);
        expect(res.statusCode).equals(200);
        expect(res.body.results.length).to.equal(0);
    });

    it('get addresses by id', async () => {
        res = await agent.get('/address/' + addressId);
        expect(res.statusCode).equals(200);
        expect(res.body).to.include({
            cep: '06622-200',
            street: 'Rua São Bernardo 0',
            streetNumber: '420',
            district: 'Parque Santa Tereza',
            city: 'Barueri',
            state: 'SP',
            country: 'Brazil',
        });
    });

    it('get non-existent address by id', async () => {
        res = await agent.get('/address/-1');
        expect(res.statusCode).equals(404);
    });

    it('insert address', async () => {
        res = await agent.post('/address/' + personOneId).send({
            cep: '06622-200',
            street: 'Rua São Bernardo',
            streetNumber: 420,
            district: 'Parque Santa Tereza',
            city: 'Barueri',
            state: 'SP',
            country: 'Brazil',
        });
        expect(res.statusCode).equals(200);

        res = await agent.post('/address/' + personOneId).send({
            cep: '06622-200',
            street: 'Rua teste',
            streetNumber: 420,
            district: 'Parque teste',
            city: 'teste',
            state: 'SP',
            country: 'Brazil',
        });
        expect(res.statusCode).equals(200);

        res = await agent.get('/addresses/' + personOneId);
        expect(res.statusCode).equals(200);
        expect(res.body.results[0]).to.include({
            cep: '06622-200',
            street: 'Rua São Bernardo',
            streetNumber: '420',
            district: 'Parque Santa Tereza',
            city: 'Barueri',
            state: 'SP',
            country: 'Brazil',
        });
        expect(res.body.results[1]).to.include({
            cep: '06622-200',
            street: 'Rua teste',
            streetNumber: '420',
            district: 'Parque teste',
            city: 'teste',
            state: 'SP',
            country: 'Brazil',
        });
    });

    it('insert address without all required fields', async () => {
        res = await agent.post('/address/' + personOneId).send({
            cep: '06622-200',
            streetNumber: 420,
            district: 'Parque Santa Tereza',
            city: 'Barueri',
            state: 'SP',
            country: 'Brazil',
        });
        expect(res.statusCode).equals(400);
    });

    it('insert address in non-existent person', async () => {
        res = await agent.post('/address/' + -1).send({
            cep: '06622-200',
            street: 'Rua São Bernardo',
            streetNumber: 420,
            district: 'Parque Santa Tereza',
            city: 'Barueri',
            state: 'SP',
            country: 'Brazil',
        });
        expect(res.statusCode).equals(404);
    });

    it('update address with same data', async () => {
        res = await agent.put('/address/' + addressId).send({
            cep: '06622-200',
            street: 'Rua São Bernardo 0',
            streetNumber: 420,
            district: 'Parque Santa Tereza',
            city: 'Barueri',
            state: 'SP',
            country: 'Brazil',
        });
        expect(res.statusCode).equals(404);
    });

    it('update address', async () => {
        res = await agent.put('/address/' + addressId).send({
            cep: '06622-200',
            street: 'TESTE',
            streetNumber: 420,
            district: 'TESTE',
            city: 'TESTE',
            state: 'SP',
            country: 'Brazil',
        });
        expect(res.statusCode).equals(200);
        const address = res.body;

        res = await agent.get('/address/' + address.id);
        expect(res.statusCode).equals(200);
        expect(res.body).to.include({
            cep: '06622-200',
            street: 'TESTE',
            streetNumber: '420',
            district: 'TESTE',
            city: 'TESTE',
            state: 'SP',
            country: 'Brazil',
        });
    });

    it('update address without one field', async () => {
        res = await agent.put('/address/' + addressId).send({
            cep: '06622-200',
            street: 'TESTE',
            streetNumber: 420,
            city: 'TESTE',
            state: 'SP',
            country: 'Brazil',
        });
        expect(res.statusCode).equals(400);
    });

    it('update non-existent address', async () => {
        res = await agent.put('/address/-1').send({
            cep: '06622-200',
            street: 'TESTE',
            streetNumber: 420,
            district: 'TESTE',
            city: 'TESTE',
            state: 'SP',
            country: 'Brazil',
        });
        expect(res.statusCode).equals(404);
    });

    it('delete address', async () => {
        res = await agent.post('/address/' + personOneId).send({
            cep: '06622-200',
            street: 'Rua São Bernardo',
            streetNumber: 420,
            district: 'Parque Santa Tereza',
            city: 'Barueri',
            state: 'SP',
            country: 'Brazil',
        });
        expect(res.statusCode).equals(200);

        res = await agent.delete('/address/' + res.body.id).send();
        expect(res.statusCode).equals(200);
    });

    it('delete non-existent address', async () => {
        res = await agent.delete('/address/-1').send();
        expect(res.statusCode).equals(404);
    });

    after(async () => {
        await db.User.destroy({ where: {} });
        await db.People.destroy({ where: {} });
        await db.Address.destroy({ where: {} });
    });
});
