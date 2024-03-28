import { db } from '../database';
import { Request, Response } from 'express';

class PeopleController {

  async getPeople(req: Request, res: Response) {
    try {
      const data = await db.People.findAll();
      return res.json(data);
    } catch {
      return res.sendStatus(500);
    }
  };

  async getPersonById(req: Request, res: Response) {
    try {
      const data = await db.People.findAll();
      return res.json(data);
    } catch {
      return res.sendStatus(500);
    }
  };

  async createPerson(req: Request, res: Response) {
    try {
      const { name, gender, dateOfBirth, maritalStatus, address } = req.body;
  
      const data = await db.People.create({
        name,
        gender,
        dateOfBirth,
        maritalStatus,
        address
      });
  
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async updatePerson(req: Request, res: Response) {
    try {
      const { name, gender, dateOfBirth, maritalStatus, address } = req.body;
      const { id } = req.params;

      if (!id) {
        return res.sendStatus(400)
      }

      const person = await db.People.findByPk(Number(id));

      if (!person) {
        return res.sendStatus(400)
      }
  
      const data = await person.update({
        name,
        gender,
        dateOfBirth,
        maritalStatus,
        address
      });
  
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async deletePerson(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.sendStatus(400)
      }

      const person = await db.People.findByPk(Number(id));

      if (!person) {
        return res.sendStatus(400)
      }
  
      const data = await person.destroy();
  
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  
};

const peopleController = new PeopleController();
export default peopleController;