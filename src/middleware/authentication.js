const { db } = require('../database');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthService {
    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async register(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(404).json({ message: 'Nome de usuário e senha em falta!' });
            }

            const userExists = await db.User.findOne({ where: { username } });

            if (userExists) {
                return res.status(404).json({ message: 'Nome de usuário já existente!' });
            }

            const passwordValidate = await db.User.passwordValidate(password);
            if (!passwordValidate) {
                return res.status(409).json({ message: 'Missing password requirements' });
            }

            const passwordHashed = db.User.encryptPassword(password);

            const user = await db.User.create({ username, password: passwordHashed });

            delete user.dataValues.password;

            return res.json(user);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json({ message: 'Aconteceu algo inesperado' + err });
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async login(req, res) {
        try {
            const { username, password } = req.body;

            const user = await db.User.findOne({
                where: { username: username },
            });

            if (!user) {
                return res.status(404).json('Usuário não existe.');
            }

            const validatePassword = await user.authenticate(password, user.password);

            if (!validatePassword) {
                return res.status(404).json({ success: false });
            }

            const token = jwt.sign({ id: user.id }, String(process.env.JWT_SECRET_KEY), { expiresIn: '1d' });

            user.dataValues.token = token;
            delete user.dataValues.password;

            return res.json(user);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json(err);
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     * @param {import('express').NextFunction} next
     */
    async sessionOrJwt(req, res, next) {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.sendStatus(401);
        }

        const token = authorization.replace('Bearer', '').trim();

        try {
            const data = jwt.verify(token, String(process.env.JWT_SECRET_KEY));

            const { id } = data;

            const user = await db.User.findOne({
                where: { id: id },
            });
            if (!user) {
                throw new Error('User not found');
            }

            delete user.dataValues.password;

            req.user = user;
            req.userId = id;

            return next();
        } catch (err) {
            // istanbul ignore next
            return res.status(401).json(err);
        }
    }
}

module.exports = new AuthService();
