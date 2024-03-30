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
    app.get('/users', auth.sessionOrJwt, userController.getUser);
    app.get('/users/:id', auth.sessionOrJwt, userController.getUserById);
    app.put('/users/:id', auth.sessionOrJwt, userController.updateUser);
    app.delete('/users/:id', auth.sessionOrJwt, userController.deleteUser);

    // People Controller
    app.get('/person', auth.sessionOrJwt, peopleController.getPersonById);
    app.get('/people', peopleController.getPeople);
    app.post('/person', auth.sessionOrJwt, peopleController.createPerson);
    app.put('/person/:id', auth.sessionOrJwt, peopleController.updatePerson);
    app.delete('/person/:id', auth.sessionOrJwt, peopleController.deletePerson);

    // Addresses Controller
    app.post('/address/:id', auth.sessionOrJwt, addressController.insertAddress);
    app.get('/address/:id', auth.sessionOrJwt, addressController.getAddresses);
    app.delete('/address/:id', auth.sessionOrJwt, addressController.deleteAddress);
};
