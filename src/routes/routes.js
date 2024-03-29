const peopleController = require('../controllers/peopleController');
const userController = require('../controllers/userController');

/**
 *
 * @param {import('../index')} app
 * @param {import('../middleware/authentication')} auth
 */
exports.init = function (app, auth) {
    app.post('/login', auth.login);
    app.post('/register', auth.register);

    app.get('/users', auth.sessionOrJwt, userController.getUser);
    app.get('/users/:id', auth.sessionOrJwt, userController.getUserById);
    app.put('/users/:id', auth.sessionOrJwt, userController.updateUser);
    app.delete('/users/:id', auth.sessionOrJwt, userController.deleteUser);

    app.get('/person', auth.sessionOrJwt, peopleController.getPersonById);
    app.get('/people', peopleController.getPeople);
    app.post('/person', auth.sessionOrJwt, peopleController.createPerson);
    app.put('/person/:id', auth.sessionOrJwt, peopleController.updatePerson);
    app.delete('/person/:id', auth.sessionOrJwt, peopleController.deletePerson);
};
