const addressController = require('../controllers/addressController');
const peopleController = require('../controllers/peopleController');
const userController = require('../controllers/userController');

/**
 *
 * @param {import('../index')} app
 * @param {import('../middleware/authentication')} auth
 */
exports.init = function (app, auth) {

    // User Login
    app.post('/login', auth.login);
    app.post('/register', auth.register);

    // User Controller
    app.get('/users', auth.jwt, userController.getUsers);
    app.get('/users/:id', auth.jwt, userController.getUserById);
    app.put('/users/:id', auth.jwt, userController.updateUser);
    app.delete('/users/:id', auth.jwt, userController.deleteUser);

    // People Controller
    app.get('/people', peopleController.getPeople);
    app.get('/person/:id', auth.jwt, peopleController.getPersonById);
    app.post('/person', auth.jwt, peopleController.createPerson);
    app.put('/person/:id', auth.jwt, peopleController.updatePerson);
    app.delete('/person/:id', auth.jwt, peopleController.deletePerson);

    // Addresses Controller
    app.get('/addresses/:id', addressController.getAddresses);
    app.get('/address/:id', auth.jwt, addressController.getAddressById);
    app.post('/address/:id', auth.jwt, addressController.insertAddress);
    app.put('/address/:id', auth.jwt, addressController.updateAddress);
    app.delete('/address/:id', auth.jwt, addressController.deleteAddress);
};
