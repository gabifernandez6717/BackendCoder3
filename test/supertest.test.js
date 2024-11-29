import supertest from "supertest";//Modulo de supertest
import chai from "chai";//Libreria de asercines para node js
import {faker} from "@faker-js/faker"
const expect = chai.expect
const requester = supertest("http://localhost:8080")//Esta constante se encarga de hacer las peticiones al servidor

describe("Testing de la app", () => {

    // TEST DE ADOPCIONES
    describe("Test de adopciones (/api/adoptions)",  ()=>{
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
    })





////////////////////////// OTROS TEST //////////////////////////





    describe("Test de mascotas (/api/pets)", () => {
        it("Post de api/pets debe crear una mascota correctamente", async ()=>{
            const mascota = {
                name: "mascotaTest",
                specie: "bicho",
                birthDate: new Date(),
                adopted: false,
                owner:"12dwcefg354y65",
                image: 'www.charango.com'
            }
            const {_body} = await requester.post("/api/pets").send(mascota);
            expect(_body.payload).to.have.property("_id")
        })
        it("Al crear una mascota su propiedad adopted tiene que ser false", async ()=>{
            const mascota = {
                name: "mascotaTest",
                specie: "bicho",
                birthDate: new Date(),
                adopted: false,
                owner:"12dwcefg354y65",
                image: "www.charango.com"
            }
            const {statusCode,_body} = await requester.post("/api/pets").send(mascota);
            expect(statusCode).to.equal(200)
            expect(_body.payload).to.have.property("adopted").that.equals(false)
        })
        it("Al crear una mascota sin su propiedad name, se debe recibir un statusCode de 400", async ()=>{
            const mascota = {
                specie: "bicho",
                birthDate: new Date(),
                adopted: true,
                owner:"12dwcefg354y65",
                image: "www.charango.com"
            }
            const {statusCode} = await requester.post("/api/pets").send(mascota);
            expect(statusCode).to.equal(400)
        })
        it("Al obtener una mascota la respuesta tiene que tener los campos status y payload", async ()=>{
            const {statusCode, _body} = await requester.get("/api/pets")
            expect(statusCode).to.equal(200)
            expect(_body).to.have.property("payload").that.is.an("array")
            expect(_body).to.have.property("status").that.equals("success")
        })
        it("Al editar una mascota los datos antiguos deben ser distintos a los nuevos", async ()=>{
            const mascota = {
                name: "mascotaTest",
                specie: "bicho",
                birthDate: new Date(),
                adopted: true,
                owner:"12dwcefg354y65",
                image: "www.charango.com"
            }
            const { _body: createResponse } = await requester.post("/api/pets").send(mascota);
            const newMascota = {
                name: "newMascotaTest",
                specie: "newbichito"
            }
            const { _body: updateResponse } = await requester.put(`/api/pets/${createResponse.payload._id}`).send(newMascota);
            expect(createResponse.payload).to.not.equal(updateResponse.payload)
        })
        it("El metodo delete debe poder borrar la ultima mascota agregada", async ()=>{
            const mascota = {
                name: "mascotaTestBorrar",
                specie: "bichoBorrar",
                birthDate: new Date(),
                adopted: true,
                owner:"12dwcefg354y65",
                image: "www.charango.com"
            }
            const { _body: createResponse } = await requester.post("/api/pets").send(mascota);
            const id = createResponse.payload._id
            const {statusCode} = await requester.delete(`/api/pets/${id}`)
            expect(statusCode).to.equal(200)
        })
        it("Debe poder crear una mascota con la ruta de la imagen", async () => {
            const Pet = {
                name: "mascotaPrueba",
                specie: "Perro",
                birthDate: "10-11-2022"
            }
            const response = await requester.post("/api/pets/withimage")
            .field("name", Pet.name)
            .field("specie", Pet.specie)
            .field("birthDate", Pet.birthDate)
            .attach("image", "src/public/img/img.jpg")
            expect(response.status).to.be.equal(200)
            expect(response._body.payload).to.have.property("_id")
            expect(response._body.payload.image).to.be.ok
        })
    })
    describe("Test avanzado (/api/sessions)", ()=>{
        let cookie
        let password = '12345678'
        let mockEmail = faker.internet.email()
        it("Debe registrar un usuario", async function(){
            const usuario = {
                first_name : faker.person.firstName(),
                last_name : faker.person.lastName(),
                email : mockEmail,
                password : password
            }
            const { _body } = await requester.post("/api/sessions/register").send(usuario)
            expect(_body.payload).to.be.ok
        })
        it("Debe loguear correctamente un usuario y recuperar la cookie", async function(){
            const usuario = {
                email : mockEmail,
                password : password
            }
            const response = await requester.post("/api/sessions/login").send(usuario)
            const cookieResponse = response.headers['set-cookie'][0]
            expect(cookieResponse).to.be.ok
            cookie = {
                name : cookieResponse.split('=')[0],
                value: cookieResponse.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.equal("coderCookie")
            expect(cookie.value).to.be.ok
        })
        it("Debe enviar la cookie que contiene el usuario", async function() {
            const {_body} = await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`])
            expect(_body.payload.email).to.be.eql(mockEmail)
        })
    })

})