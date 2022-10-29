import { Router } from 'express'
import upload from '../configs/multer.js'
import controller from '../controllers/padrones.controller.js'

const route = Router()

route.post("/previzualizarDiplomaSegunPadron", upload, controller.previsualizarDiplomaSegunPadron)

export default route
