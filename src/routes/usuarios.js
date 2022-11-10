import { Router } from 'express'
import ctrl from '../controllers/usuarios.controller.js'
const router = Router()

router.post('/create', ctrl.create)

router.get('/getAll', ctrl.getAll)

router.get('/getOne', ctrl.getOne)

router.put('/update', ctrl.update)

router.delete('/delete', ctrl.delete)

router.put('/changePass', ctrl.changePassword)

router.put('/login', ctrl.login)

export default router