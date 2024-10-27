import {faker} from "@faker-js/faker"
import { createHash } from '../utils/index.js';

class MockingService{
    static async generateUsers (quantity){
        let users = []
        try {
            for (let index = 0; index < quantity; index++) {
                let number = faker.number.int({min: 1, max:2})
                const password = await createHash("coder123")
                users.push({
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName(),
                    email: faker.internet.email(),
                    password,
                    role : number === 1 ? "user" : "admin",
                    pets : []
                })
            }
            return users
        } catch (error) {
            console.log(error);
            return "Hubo un error"
        }
    }
    static async generatepets (quantity){
        let pets = []
        try {
            for (let index = 0; index < quantity; index++) {
                pets.push(
                    {
                        name : faker.person.firstName(),
                        specie : faker.animal.type(),
                    }
                )
            }
            return pets
        } catch (error) {
            console.log(error)
            return "Hubo un error";
        }
    }
}
export default MockingService