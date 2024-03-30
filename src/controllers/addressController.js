const { db } = require('../database');

class AddressController {
    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async insertAddress(req, res) {
        try {
            const { cep, street, streetNumber, district, city, state, country, complement } = req.body;
            console.log(req.params.id);
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
    async getAddresses(req, res) {
        try {
            const query = req.query;
            const page = query.page || 0;
            const maxResults = query.limit || 10;
            const offset = page * maxResults;
            const data = await db.Address.findAndCountAll({
                offset: offset,
                limit: maxResults,
                where: {
                    personId: req.params.id,
                },
                include: {
                    model: db.People,
                    attributes: {
                        exclude: ['personId'],
                    },
                },
            });

            console.log('teste');
            const pages = Math.ceil(data.count / maxResults);

            return res.json({
                page: page,
                data: data.rows,
                pages: pages,
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
