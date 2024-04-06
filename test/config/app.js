/* eslint-disable dot-notation */
require('dotenv').config();
process.env.DISABLED_LOGS = true;
const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../src/index.js');
const { Router } = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routeInitialization = require('../../src/routes/config.js');
const authentication = require('../../src/middleware/authentication');

const allowedOrigins = [process.env.FRONTEND_ORIGIN];

const options = {
    origin: String(allowedOrigins)
};

const router = Router();
const routes = routeInitialization(router, authentication);

app.use(bodyParser.json());
app.use(cors(options));
app.use(routes);

const agent = supertest.agent(app);
agent.on('response', async (response) => {
    if (response['req'].path === "/login") {
        authAgent(agent, response.body.token);
    }
    if (response['req'].path === "/logout") {
        logoutAgent(agent);
    }
});

function anotherAgent() {
    const thisAgent = supertest.agent(app);
    thisAgent.on('response', async (response) => {
        if (response['req'].path === "/login") {
            authAgent(thisAgent, response.body.token);
        }
        if (response['req'].path === "/logout") {
            logoutAgent(thisAgent);
        }
    });
    return thisAgent;
}

function authAgent(agent, token) {
    agent.use((req) => {
        req.set({ "Authorization": "Bearer " + token });
    });
}

function logoutAgent(agent) {
    agent.use((req) => {
        req.unset('Authorization');
    });
}



module.exports = { app, chai, expect, supertest, agent, anotherAgent };