const { db } = require('../database');
const { Op } = require('sequelize');

class AddressController {
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
            const count = await db.Address.count({ where: whereClause });

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
    async getAddressById(req, res) {
        try {
            const address = await db.Address.findByPk(Number(req.params.id));
            if (!address) {
                return res.status(404).json({ success: false });
            }
            return res.status(200).json(address);
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
    async insertAddress(req, res) {
        try {
            const { cep, street, streetNumber, district, city, state, country, complement } = req.body;
            const person = await db.People.findOne({ where: { id: req.params.id } });

            if (!person) {
                return res.status(404).send(console.log('Pessoa não existe!'));
            }

            if (!cep || !street || !streetNumber || !district || !city || !state || !country) {
                return res.status(400).send({ message: 'Complete todas as fields' });
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

            return res.status(200).json(address);
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
    async updateAddress(req, res) {
        try {
            const { cep, street, streetNumber, district, city, state, country, complement } = req.body;
            const address = await db.Address.findByPk(req.params.id);

            if (!address) {
                return res.status(404).send({ message: 'Endereço não existe' });
            }

            if (!cep || !street || !streetNumber || !district || !city || !state || !country) {
                return res.status(400).send({ message: 'Complete todas as fields' });
            }

            if (cep === address.cep &&
                street === address.street &&
                streetNumber === address.streetNumber &&
                district === address.district &&
                city === address.city &&
                state === address.state &&
                country === address.country &&
                complement === address.complement) {
                return res.status(404).send({ message: 'Dados não alterados' });
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

            return res.status(200).json(address);
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
    async deleteAddress(req, res) {
        try {
            const address = await db.Address.findOne({
                where: { id: req.params.id },
            });

            if (!address) {
                return res.status(404).status({ message: 'Endereço não existe' });
            }

            address.destroy({});

            return res.sendStatus(200);
        } catch (err) {
            // istanbul ignore next
            return res.status(500).json(err);
        }
    }
}

module.exports = new AddressController();
