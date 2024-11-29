import mongoose from 'mongoose';
import adoption from "../src/dao/Adoption.js"
import chai from "chai"

const expect = chai.expect
mongoose.connect(`mongodb+srv://gabito2005usa:backend3@backend3.xrn3q.mongodb.net/`)

describe("Testing de adoption con chai", function () {

    before(function () {
        this.adoptionDao = new adoption()
    })

    // Caso de éxito en metodo post
    let petId
    it("El post debe crear una adoption correctamente (/api/adoptions/:uid/:pid)", async () => {
        const {_body: pet} = await requester.get("/api/pets")
        const mascota = await pet.payload.find(m=>m.adopted==false) //Busca un pet real con la propiedad adopted en false
        petId = mascota._id // Recupera su id y lo guarda en una variable global, para usarla en otro test
        const userId = "67472ef7340482dabf46493b" // UserID real copiado de la db
        const response = await requester.post(`/api/adoptions/${userId}/${petId}`)
        expect(response.statusCode).to.be.equal(200)
    })
    // Caso de error en metodo post: Error por intentar adoptar una mascota ya adoptada
    it("Debe devolver error si la mascota ya está adoptada (/api/adoptions/:uid/:pid)", async () => {
        const userId = "673ca5271fa542a70f61e77b";
        const response = await requester.post(`/api/adoptions/${userId}/${petId}`);
        expect(response.statusCode).to.be.equal(400) // Error si la mascota ya fue adoptada
        expect(response._body).to.have.property("error")
    })
    // Caso de éxito: Obtener una de las las adopciones
    it("El get debe obtener una adoption correctamente (/api/adoptions/:aid)", async () => {
        let adoptionId = "674653e0ca715f732d058544"//adoptionID real
        const response = await requester.get(`/api/adoptions/${adoptionId}`)
        expect(response._body.payload).to.have.property("_id");
        expect(response.statusCode).to.be.equal(200)
    });
    // Caso de éxito: Obtener todas las adopciones
    it("El get debe devolver las adoptions correctamente (/api/adoptions)", async () => {
        const response = await requester.get(`/api/adoptions/`)
        expect(Array.isArray(response._body.payload)).to.be.true
    })
    // Caso de error: Error del servidor (ejemplo genérico)
    it("Debe devolver error 500 en caso de error interno del servidor", async () => {
        const response = await requester.get(`/api/adoptions/`);
        expect(response.statusCode).to.be.not.equal(500);  // Error del servidor si algo falla internamente
    })

    //Despues de las pruebas se desconecta de la db
    after(async function() {
        await mongoose.disconnect()
    })
})