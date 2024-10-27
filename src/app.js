import express from 'express';
import mongoose from 'mongoose';
mongoose.set('strictQuery', true);// Para eliminar una advertencia
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'
import addLogger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT||8080;

app.use(express.json());
app.use(cookieParser());
app.use(addLogger)

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);

app.listen(PORT,async ()=>{
    const connection = await mongoose.connect(`mongodb+srv://gabito2005usa:backend3@backend3.xrn3q.mongodb.net/`)
    console.log(`listening on http://localhost:${PORT}`);
})
