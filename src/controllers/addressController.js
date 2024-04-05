const { db } = require('../database');
const { Op } = require('sequelize');

class AddressController {
    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async insertAddress(req, res) {
        try {
            const { cep, street, streetNumber, district, city, state, country, complement } = req.body;
            const person = await db.People.findOne({ where: { id: req.params.id } });

            if (!person) {
                return res.status(404).send(console.log('teste'));
            }

            const address = await db.Address.create({
                cep: cep,
                street: street,
                streetNumber: streetNumber,
                district: district,
                city: city,
                state: state,
                country: country,
                complement: complement,
            });

            await address.setPerson(person);

            return res.sendStatus(200);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async updateAddress(req, res) {
        try {
            const { cep, street, streetNumber, district, city, state, country, complement } = req.body;
            const address = await db.Address.findByPk(req.params.id);

            if (!address) {
                return res.status(404).send(console.log('teste'));
            }

            const data = {
                cep,
                street,
                streetNumber,
                district,
                city,
                state,
                country,
                complement,
            };

            await address.update(data);

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
    async getAddresses(req, res) {
        try {
            const params = req.query;
            const maxResults = params.limit ? Number(params.limit) : 10;
            const offset = params.page ? (Number(params.page) - 1) * maxResults : 0;

            const whereClause = { personId: req.params.id };

            if (params.category && params.search) {
                const category = params.category.toLowerCase();
                const searchValue = params.search.toLowerCase();
                if (['street', 'district'].includes(params.category)) {
                    whereClause[category] = { [Op.like]: `%${searchValue}%` };
                } else {
                    whereClause[category] = searchValue;
                }
            }

            const queryObj = {
                offset: offset,
                limit: maxResults,
                include: {
                    model: db.People,
                    attributes: {
                        exclude: ['personId'],
                    },
                },
                where: whereClause,
            };

            const threads = await db.Address.findAll(queryObj);
            const count = await db.Address.count({ where: whereClause});

            return res.status(200).json({
                total: count,
                max_results: maxResults,
                page: Number(params.page),
                pages: Math.ceil(count / maxResults),
                results: threads,
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async deleteAddress(req, res) {
        try {
            const address = await db.Address.findOne({
                where: { id: req.params.id },
            });

            if (!address) {
                return res.sendStatus(404);
            }

            address.destroy({});

            return res.sendStatus(200);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = new AddressController();
