import mongoose from 'mongoose';
import User from "../src/dao/Users.dao.js"
import chai from "chai"

const expect = chai.expect
mongoose.connect(`mongodb+srv://gabito2005usa:backend3@backend3.xrn3q.mongodb.net/`)

describe("Testing de users con chai", function () {

    before(function () {
        this.usersDao = new User()
    })

    beforeEach( function () {
        mongoose.connection.collections.users.drop()
        this.timeout(10000)
    })

    it("El user debe devolver un array", async function () {
        const response = await this.usersDao.get()
        expect(Array.isArray(response)).to.be.true
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
        expect(response).to.have.property("_id")//Se verifica que se cree el documento en MongoDb
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
        expect(response.pets).to.deep.equal([]) //Se verifica que pets sea por default un array vacio
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
        expect(userByEmail).to.be.an("object")
    })

    //Despues de las pruebas se desconecta de la db
    after(async function() {
        await mongoose.disconnect()
    })
})