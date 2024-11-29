import express from 'express';
import mongoose from 'mongoose';
mongoose.set('strictQuery', true);// Para eliminar una advertencia
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'
import addLogger from './utils/logger.js';

const swaggerOptions = {
    definition:{
        openapi: "3.0.1",
        info: {
            title: "Documentación de adoptme",
            description: "App para encontrar dueños a animales"
        }
    },
    apis:["./src/docs/**/*.yaml"]// Cualquier carpeta dentro de docs y cualquier archivo con la extension: .yaml
}
const specs = swaggerJSDoc(swaggerOptions)
const app = express();
const PORT = process.env.PORT||8080;
const connection = await mongoose.connect(`mongodb+srv://gabito2005usa:backend3@backend3.xrn3q.mongodb.net/`)

app.use(express.json());
app.use(cookieParser());
app.use(addLogger)
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.use('/api/mocks',mocksRouter);
// EJ:
// http://localhost:8080/api/mocks/mockingusers
// http://localhost:8080/api/mocks/mockingusers?quantity=3

app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.listen(PORT,async ()=>{
    console.log(`listening on http://localhost:${PORT}`);
})
