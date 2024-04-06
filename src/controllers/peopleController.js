const { db } = require('../database');
const { Op } = require('sequelize');

class PeopleController {
    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async getPeople(req, res) {
        try {
            const params = req.query;
            const maxResults = params.limit ? Number(params.limit) : 10;
            const offset = params.page ? (Number(params.page) - 1) * maxResults : 0;

            const whereClause = {};

            if (params.category && params.search) {
                const category = params.category.toLowerCase();
                const searchValue = params.search.toLowerCase();
                if (params.category === 'name') {
                    whereClause[category] = { [Op.like]: `%${searchValue}%` };
                } else {
                    whereClause[category] = searchValue;
                }
            }

            const queryObj = {
                offset: offset,
                limit: maxResults,
                include: {
                    model: db.Address,
                    attributes: {
                        exclude: ['personId'],
                    },
                },
                where: whereClause,
            };

            const threads = await db.People.findAll(queryObj);
            const count = await db.People.count();

            return res.status(200).json({
                total: count,
                max_results: maxResults,
                page: Number(params.page),
                pages: Math.ceil(count / maxResults),
                results: threads,
            });
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
    async getPersonById(req, res) {
        try {
            const person = await db.People.findByPk(Number(req.params.id));
            if (!person) {
                return res.status(404).json({ success: false });
            }
            return res.status(200).json(person);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json({ success: false });
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
            // istanbul ignore next
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

            const person = await db.People.findByPk(Number(req.params.id));

            if (!person) {
                return res.sendStatus(404);
            }

            if (!name || !gender || !dateOfBirth || !maritalStatus) {
                return res.sendStatus(400);
            }

            const data = {
                name,
                gender,
                dateOfBirth,
                maritalStatus,
            };

            await person.update(data);

            return res.status(200).json(data);
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
    async deletePerson(req, res) {
        try {
            const person = await db.People.findByPk(Number(req.params.id));

            if (!person) {
                return res.sendStatus(404);
            }

            const data = await person.destroy();

            return res.status(200).json(data);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json(err);
        }
    }
}

module.exports = new PeopleController();
