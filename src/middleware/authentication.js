const { db } = require('../database');
const jwt = require('jsonwebtoken');
const moment = require('moment');
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
                return res.status(409).json({ message: 'Nome de usuário e senha em falta!' });
            }

            const userExists = await db.User.findOne({ where: { username } });

            if (userExists) {
                return res.status(409).json({ message: 'Nome de usuário já existente!' });
            }

            const passwordValidate = await db.User.passwordValidate(password);
            if (!passwordValidate) {
                return res.status(400).json({ message: "Missing password requirements" });
            }

            const passwordHashed = db.User.encryptPassword(password);

            const user = await db.User.create({ username, password: passwordHashed });

            delete user.dataValues.password;

            return res.json(user);
        } catch (err) {
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
            // await lResCleaner(user.dataValues);

            const sessionExists = await db.Session.findOne({
                where: {
                    userId: user.id,
                },
            });

            if (sessionExists) {
                await db.Session.destroy({
                    where: {
                        userId: user.id,
                    },
                });
                const session = await db.Session.create({
                    expiration_date: moment().add(3, 'day').valueOf(),
                    jwt: null,
                });
                session.setUser(user);
                await session.save();

                user.dataValues.token = session.sessionId;
                return res.json(user);
            }

            const newSession = await db.Session.create({
                expiration_date: moment().add(3, 'day').valueOf(),
                jwt: null,
            });
            newSession.setUser(user);
            await newSession.save();

            user.dataValues.token = newSession.sessionId;
            return res.json(user);
        } catch (err) {
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
        const tokenLength = token.length;

        if (tokenLength <= 36) {
            try {
                const data = await db.Session.findOne({
                    where: {
                        expiration_date: db.sequelize.literal('expiration_date > NOW()'),
                        sessionId: token,
                    },
                });

                if (!data) {
                    return res.status(401).json({ error: 'Invalid sessionId.' });
                }

                const user = await db.User.findOne({
                    where: { id: data.UserId },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: {
                        model: db.Permissions,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                });
                if (!user) {
                    throw new Error('User not found');
                }

                req.user = user;
                req.userId = user.id;
                req.is_master_admin = user.Permission.master_admin_level;

                return next();
            } catch (err) {
                return res.sendStatus(401);
            }
        } else {
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
                req.is_master_admin = user.Permission.master_admin_level;

                return next();
            } catch (err) {
                return res.sendStatus(401);
            }
        }
    }
}

module.exports = new AuthService();
