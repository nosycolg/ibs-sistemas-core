const { db } = require('../database');

class UserController {
    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async getUserData(req, res) {
        try {
            const { authorization } = req.headers;

            if (!authorization) {
                return res.sendStatus(401);
            }

            const token = authorization.replace('Bearer', '').trim();

            if (!token) {
                return res.sendStatus(401);
            }

            const user = await db.User.findOne({
                where: {
                    id: req.userId,
                },
            });

            if (!user) {
                return res.status(404).json({ success: false });
            }

            user.dataValues.token = token;

            return res.json(user);
        } catch (err) {
            console.error(err);
            return res.status(401).json({ success: false });
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async getUsers(req, res) {
        try {
            const users = await db.User.findAll();
            return res.json(users);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json({ message: 'Aconteceu algo inesperado' });
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async getUserById(req, res) {
        try {
            const user = await db.User.findOne({
                where: { id: req.params.id },
            });
            if (user) {
                return res.json(user);
            }
            res.status(404).json({ message: 'Usuário não existe!' });
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json({ message: 'Aconteceu algo inesperado' });
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async updateUser(req, res) {
        try {
            if (!req.body.username || !req.body.password) {
                return res.status(409).json({ message: 'Nome de usuário e senha em falta!' });
            }

            const { username, password } = req.body;

            const { id } = req.params;

            const user = await db.User.findByPk(id);
            const userExists = await db.User.findOne({ where: { username } });

            if (!user) {
                return res.status(404).json({ message: 'Usuário inexistente!' });
            }
            if (userExists) {
                return res.status(409).json({ message: 'Nome de usuário já existente!' });
            }

            const data = await user.update({
                username,
                password,
            });

            return res.json(data);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json({ message: 'Aconteceu algo inesperado' });
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async deleteUser(req, res) {
        try {
            const user = await db.User.findOne({
                where: { id: req.params.id },
            });
            if (!user) {
                return res.status(404).json({ message: 'Usuário inexistente!' });
            }

            await user.destroy();
            return res.json(user);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json({ message: 'Aconteceu algo inesperado' });
        }
    }
}

module.exports = new UserController();
