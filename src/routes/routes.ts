import express from 'express';
import peopleController from '../controllers/peoplesController';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.get('/person', peopleController.getPersonById);
app.get('/people', peopleController.getPeople);
app.post('/person', peopleController.createPerson);
app.put('/person/:id', peopleController.updatePerson);
app.delete('/person/:id', peopleController.deletePerson);

export default app