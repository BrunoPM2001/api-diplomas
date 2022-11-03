import { Router } from 'express'
import upload from '../configs/multer.js'
import controller from '../controllers/padrones.controller.js'

const router = Router()

router.get("/getAll", controller.getAll)

router.get("/getOne", controller.getOne)

router.post("/generateFromExcel", upload, controller.generate)

router.put("/update", controller.update)

router.delete("/deletePadron", )

router.post("/loadPadron", upload)

router.post("/previsualizarDiplomaSegunPadron", upload, controller.previsualizarDiplomaSegunPadron)

router.post("/previsualizarDiploma", controller.previsualizarDiploma)

export default router
