const { db } = require('../database');

class UserController {
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
            return res.status(500).json(err);
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

            return res.sendStatus(404);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json(err);
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
                return res.sendStatus(409);
            }

            const { username, password } = req.body;

            const { id } = req.params;

            const user = await db.User.findByPk(id);
            const userExists = await db.User.findOne({ where: { username } });

            if (!user) {
                return res.sendStatus(404);
            }
            if (userExists) {
                return res.sendStatus(409);
            }

            const data = await user.update({
                username,
                password,
            });

            return res.json(data);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json(err);
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
                // istanbul ignore next

                return res.sendStatus(404);
            }

            await user.destroy();
            return res.json(user);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json(err);
        }
    }
}

module.exports = new UserController();
