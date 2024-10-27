import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router()

router.get("/warning", (req, res) => {
    req.logger.warn("warning generado a proposito")
    res.send("prueba de warning")
})
router.get("/test", (req, res) => {
    req.logger.debug("debug")
    req.logger.http("Mensaje de http")
    req.logger.info("Mensaje de info")
    req.logger.warning(" Mensaje de warn")
    req.logger.error("Mensaje de error")
    req.logger.fatal("Mensaje de fatal")
    res.send("test de todos los loggers")
})
router.get("/mockingpets", mocksController.getPets)
router.get("/mockingusers", mocksController.getUsers)
router.post("/generateData", mocksController.getData)

export default router