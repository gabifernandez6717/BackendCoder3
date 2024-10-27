import { petsService, usersService } from "../services/index.js";
import MockingService from "../services/mocking.services.js";

const getPets = async (req, res) => {
    try {
        const quantity = req.query.quantity
        const pets = await MockingService.generatepets(quantity?Number(quantity):100)
        res.send(pets)
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }
}

const getUsers = async (req, res) => {
    try {
        const quantity = req.query.quantity
        const users = await MockingService.generateUsers(quantity?Number(quantity):50)
        res.send(users).status(200)
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }
}
const getData = async (req, res) => {
    try {
        const { users, pets } = req.body
        if (users && pets) {
            const usersGenerados = await MockingService.generateUsers(Number(users))
            const petsGenerados= await MockingService.generatepets(Number(pets))
            await Promise.all(
                // Se inserta en la DB
                usersGenerados.map(users => usersService.create(users)),
                petsGenerados.map(pets => petsService.create(pets))
            )
            res.status(200).send("Data creada.")
        } else {
            res.status(400).send("Debe enviar todos los datos.")
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error en controller")
    }
}
// {
//     "users" : 2,
//     "pets" : 3
// }

export default {
    getPets,
    getUsers,
    getData
}