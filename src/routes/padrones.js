import { Router } from 'express'
import upload from '../configs/multer.js'
import controller from '../controllers/padrones.controller.js'

const router = Router()

router.get("/getAll", controller.getAll)

router.get("/getOne", controller.getOne)

router.post("/generateFromExcel", upload, controller.generate)

//  no usar por el momento
router.post("/createPadron", )

router.put("/updatePadron", )

router.delete("/deletePadron", )

router.post("/loadPadron", upload)

router.post("/previsualizarDiplomaSegunPadron", upload, controller.previsualizarDiplomaSegunPadron)

export default router
