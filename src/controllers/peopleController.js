const { db } = require('../database');

class PeopleController {
    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async getPeople(req, res) {
        try {
            const query = req.query;
            let page = query.page;
            const maxResults = query.limit || 10;
            const offset = page * maxResults;
            if (page === '1') {
                page = '0';
            }

            const data = await db.People.findAndCountAll({
                offset: offset,
                limit: maxResults,
                include: {
                    model: db.Address,
                    attributes: {
                        exclude: ['personId'],
                    },
                },
            });

            const pages = Math.ceil(data.count / maxResults);

            return res.json({
                page: page,
                data: data.rows,
                pages: pages
            });
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async getPersonById(req, res) {
        try {
            const data = await db.People.findAll();
            return res.json(data);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async createPerson(req, res) {
        try {
            const { name, gender, dateOfBirth, maritalStatus } = req.body;

            const data = await db.People.create({
                name,
                gender,
                dateOfBirth,
                maritalStatus,
            });

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async updatePerson(req, res) {
        try {
            const { name, gender, dateOfBirth, maritalStatus } = req.body;
            const { id } = req.params;

            if (!id) {
                return res.sendStatus(401);
            }

            const person = await db.People.findByPk(Number(id));

            if (!person) {
                return res.sendStatus(404);
            }

            const data = {
                name,
                gender,
                dateOfBirth,
                maritalStatus,
            };

            const requiredFields = ['name', 'gender', 'dateOfBirth', 'maritalStatus'];

            if (requiredFields.every(field => data[field] === person.dataValues[field])) {
                return res.sendStatus(400);
            }

            await person.update(data);

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async deletePerson(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.sendStatus(400);
            }

            const person = await db.People.findByPk(Number(id));

            if (!person) {
                return res.sendStatus(400);
            }

            const data = await person.destroy();

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = new PeopleController();
