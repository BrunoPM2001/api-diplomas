import { Router } from 'express'
import upload from '../configs/multer.js'
import controller from '../controllers/padrones.controller.js'

const route = Router()

route.post("/loadPadron", upload, controller.generatePadron)

export default route
