import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const ctrl = {}

//  Crear usuario
ctrl.create = (req, res) => {
  try {
    //  Validar token (si está logeado)
    jwt.verify(req.header.token, process.env.JWT_KEY, async (error, user) => {
      if (error) {
        res.json({ message: "Fail", detail: "Token inválido" })
      } else {
        //  Validar que sea de cargo ADMIN
        if (user.cargo == "ADMIN") {
          const {
            dni,
            apellidos,
            nombres
          } = req.body
          await prisma.usuarios.create({
            data: {
              dni,
              apellidos,
              nombres,
              password: dni
            }
          })
          res.json({ message: "Success", detail: "Usuario creado exitosamente" })
        } else {
          res.json({ message: "Fail", detail: "No tiene permisos para realizar esta acción" })
        }
      }
    })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

//  Obtener todos los usuarios
ctrl.getAll = async (req, res) => {
  try {
    const users = await prisma.usuarios.findMany({
      select: {
        dni: true,
        apellidos: true,
        nombres: true
      }
    })
    res.json({ message: "Success", detail: users })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.getOne = (req, res) => {
  try {

  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.update = (req, res) => {
  try {

  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.delete = (req, res) => {
  try {

  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.changePassword = (req, res) => {
  try {

  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

export default ctrl
