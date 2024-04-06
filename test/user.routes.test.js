require('dotenv').config();
const { db } = require('../src/database');

const { expect, agent, anotherAgent } = require('./config/app');

const another_agent = anotherAgent();

let res;
let juniorUser;

describe('user test', async () => {
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
        juniorUser = res.body;

        res = await agent.post('/register').send({
            username: 'pleno',
            password: 'Teste01!',
        });
        expect(res.statusCode).equals(200);
        expect(res.body.token).to.not.equals(null);
    });

    it('get all users', async () => {
        res = await agent.get('/users');
        expect(res.statusCode).equals(200);
        expect(res.body).to.be.an('array').with.lengthOf(2);
    });

    it('get user by ID test', async () => {
        res = await agent.get('/users/' + juniorUser.id);
        expect(res.statusCode).equals(200);
        expect(res.body.id).equals(juniorUser.id);
    });

    it('trying to get non-existent user by ID', async () => {
        res = await agent.get('/users/-1');
        expect(res.statusCode).equals(404);
    });

    it('update user', async () => {
        res = await agent.post('/register').send({
            username: 'user_to_update',
            password: 'Abc1234$',
        });
        expect(res.statusCode).equals(200);
        const user_to_update = res.body;

        res = await agent.put('/users/' + user_to_update.id).send({
            username: 'user_updated',
            password: 'Abc1234$',
        });
        expect(res.statusCode).equals(200);
        expect(res.body).to.include({
            username: 'user_updated',
            password: 'Abc1234$',
        });
    });

    it('update user without name or username', async () => {
        res = await agent.put('/users/' + juniorUser.id).send({
            username: '',
            password: 'Abc1234$',
        });
        expect(res.statusCode).equals(409);
    });

    it('update user with non-existent id', async () => {
        res = await agent.put('/users/-1').send({
            username: 'ue',
            password: 'Abc1234$',
        });
        expect(res.statusCode).equals(404);
        expect(res.body.message).equals('Usuário inexistente!');
    });

    it('update user with existent username', async () => {
        res = await agent.put('/users/' + juniorUser.id).send({
            username: 'junior',
            password: 'Abc1234$',
        });
        expect(res.statusCode).equals(409);
        expect(res.body.message).equals('Nome de usuário já existente!');
    });

    it('register and delete Test', async () => {
        res = await agent.post('/register').send({
            username: 'user_to_delete',
            password: 'Abc1234$',
        });
        expect(res.statusCode).equals(200);
        const user_to_delete = res.body;

        res = await agent.delete('/users/' + user_to_delete.id);
        expect(res.statusCode).equals(200);

        res = await agent.get('/users/' + user_to_delete.id);
        expect(res.statusCode).equals(404);
    });

    it('delete non-existent user', async () => {
        res = await agent.delete('/users/-1');
        expect(res.statusCode).equals(404);
    });

    it('register with existent username', async () => {
        res = await agent.post('/register').send({
            username: 'junior',
            password: 'Teste01!',
        });
        expect(res.statusCode).equals(404);
    });

    it('register with invalid password', async () => {
        res = await agent.post('/register').send({
            username: 'senior',
            password: '123',
        });
        expect(res.statusCode).equals(409);
    });

    it('trying to login with wrong password', async () => {
        res = await agent.post('/login').send({
            username: 'junior',
            password: 'wrongpassword',
        });
        expect(res.statusCode).equals(404);
    });

    it('trying to login with wrong username', async () => {
        res = await agent.post('/login').send({
            username: 'wrongusername',
            password: 'Teste01!',
        });
        expect(res.statusCode).equals(404);
    });

    it('trying to register an existing user', async () => {
        res = await agent.post('/register').send({
            email: 'junior',
            password: '123456',
        });
        expect(res.statusCode).equals(404);
    });

    it('trying without token', async () => {
        res = await another_agent.get('/users').send();
        expect(res.statusCode).equals(401);
    });

    after(async () => {
        await db.User.destroy({ where: {} });
        await db.People.destroy({ where: {} });
        await db.Address.destroy({ where: {} });
    });
});
