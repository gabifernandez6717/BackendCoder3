import mongoose from 'mongoose';
import User from "../src/dao/Users.dao.js"
import assert from "assert"

mongoose.connect(`mongodb+srv://gabito2005usa:backend3@backend3.xrn3q.mongodb.net/`)

describe('Testing de modulo User', function ()  {
    //Antes que nada se hace una nueva instancia de user.dao
    before(function () {
        this.usersDao = new User()
    })
    //Para finalizar se borra todo de la db
    this.beforeEach(async function () {
        await mongoose.connection.collections.users.drop()
    })

    it("El get de users, debe retornar un array", async function () {
        const response = await this.usersDao.get()
        //Validamos que la respuesta sea estrictamente igual a un array
        assert.strictEqual(Array.isArray(response), true)
    })

    it("Se debe agregar un user nuevo a la db", async function () {
        const user = {
            first_name : 'John',
            last_name : 'Martinez',
            email : 'jhon@gmail.com',
            password : '12345678',
            role : 'admin',
            pets : []
        }
        const response = await this.usersDao.save(user)
        assert.ok(response._id)//Se verifica que se cree el documento en MongoDb
    })

    it("El user debe tener por default un array vacio en la propiedad pets", async function () {
        const user = {
            first_name : 'Martin',
            last_name : 'Juarez',
            email : 'martin@gmail.com',
            password : '12345678',
            role : 'admin',
        }
        const response = await this.usersDao.save(user)
        assert.deepStrictEqual(response.pets, [])//Se verifica que pets sea por default un array vacio
    })

    it("El dao debe poder obtener un user por su email", async function () {
        const user = {
            first_name : 'Luca',
            last_name : 'Berberena',
            email : 'luca@gmail.com',
            password : '12345678',
            role : 'admin',
        }
        const response = await this.usersDao.save(user)
        const userByEmail = await this.usersDao.getBy({email: user.email})
        assert.strictEqual(typeof user, "object")
    })

    //Despues de las pruebas se desconecta de la db
    after(async function() {
        await mongoose.disconnect()
    })
})