module.exports = function routeInitialization(app, authenticate) {
    require('./routes').init(app, authenticate);
    return app;
};
