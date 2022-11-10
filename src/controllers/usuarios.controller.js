import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { generateToken } from '../utils/tokens.js'

const prisma = new PrismaClient()

const ctrl = {}

ctrl.create = (req, res) => {
  try {
    //  Validar token (si está logeado)
    jwt.verify(req.header("Authorization"), process.env.JWT_KEY, async (error, user) => {
      if (error) {
        res.json({ message: "Fail", detail: "Token inválido" })
      } else {
        //  Validar que sea de cargo ADMIN
        if (user.cargo == "ADMIN") {
          const {
            dni,
            apellidos,
            nombres,
            cargo
          } = req.body
          await prisma.usuarios.create({
            data: {
              dni: Number(dni),
              apellidos,
              nombres,
              password: dni,
              cargo
            }
          })
          res.json({ message: "Success", detail: "Usuario creado exitosamente" })
        } else {
          res.json({ message: "Fail", detail: "No tiene permisos para realizar esta acción" })
        }
      }
    })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception", info: e })
  }
}

ctrl.getAll = async (req, res) => {
  try {
    //  Validar token (si está logeado)
    jwt.verify(req.header("Authorization"), process.env.JWT_KEY, async (error, user) => {
      if (error) {
        res.json({ message: "Fail", detail: "Token inválido" })
      } else {
        //  Validar que sea de cargo ADMIN
        if (user.cargo == "ADMIN") {
          const users = await prisma.usuarios.findMany({
            select: {
              dni: true,
              apellidos: true,
              nombres: true,
              cargo: true
            }
          })
          res.json({ message: "Success", detail: users })
        } else {
          res.json({ message: "Fail", detail: "No tiene permisos para realizar esta acción" })
        }
      }
    })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.getOne = (req, res) => {
  try {
    //  Validar token (si está logeado)
    jwt.verify(req.header("Authorization"), process.env.JWT_KEY, async (error, user) => {
      if (error) {
        res.json({ message: "Fail", detail: "Token inválido" })
      } else {
        //  Validar que sea de cargo ADMIN
        if (user.cargo == "ADMIN") {
          const { dni } = req.query
          const users = await prisma.usuarios.findFirst({
            where: {
              dni: Number(dni)
            },
            select: {
              dni: true,
              apellidos: true,
              nombres: true,
              cargo: true
            }
          })
          res.json({ message: "Success", detail: users })
        } else {
          res.json({ message: "Fail", detail: "No tiene permisos para realizar esta acción" })
        }
      }
    })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.update = (req, res) => {
  try {
    //  Validar token (si está logeado)
    jwt.verify(req.header("Authorization"), process.env.JWT_KEY, async (error, user) => {
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
          await prisma.usuarios.update({
            where: {
              dni: Number(dni)
            },
            data: {
              dni: Number(dni),
              apellidos,
              nombres
            }
          })
          res.json({ message: "Success", detail: "Data actualizada correctamente" })
        } else {
          res.json({ message: "Fail", detail: "No tiene permisos para realizar esta acción" })
        }
      }
    })

  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.delete = (req, res) => {
  try {
    //  Validar token (si está logeado)
    jwt.verify(req.header("Authorization"), process.env.JWT_KEY, async (error, user) => {
      if (error) {
        res.json({ message: "Fail", detail: "Token inválido" })
      } else {
        //  Validar que sea de cargo ADMIN
        if (user.cargo == "ADMIN") {
          const { dni } = req.query
          await prisma.usuarios.delete({
            where: {
              dni: Number(dni)
            }
          })
          res.json({ message: "Success", detail: "Usuario eliminado exitosamente" })
        } else {
          res.json({ message: "Fail", detail: "No tiene permisos para realizar esta acción" })
        }
      }
    })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.changePassword = (req, res) => {
  try {
    //  Validar token (si está logeado)
    jwt.verify(req.header("Authorization"), process.env.JWT_KEY, async (error, user) => {
      if (error) {
        res.json({ message: "Fail", detail: "Token inválido" })
      } else {
        const { password, newPassword } = req.body
        //  Actualizar contraseña si es que coincide el dni con la contraseña actual
        const users = await prisma.usuarios.updateMany({
          where: {
            dni: Number(user.dni),
            password
          },
          data: {
            password: newPassword
          }
        })
        //  Ver si se encontró algún usuario con ese dni y contraseña actual
        if (users.count == 0) {
          res.json({ message: "Fail", detail: "Datos inválidos" })
        } else {
          res.json({ message: "Success", detail: "Contraseña actualizada exitosamente" })
        }
      }
    })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.login = async (req, res) => {
  try {
    const {
      dni,
      password
    } = req.body
    const user = await prisma.usuarios.findFirst({
      where: {
        dni: Number(dni),
        password
      }
    })
    //  Validar si hay algún usuario con ese dni y contraseña
    if (user == null) {
      res.json({ message: "Fail", detail: "Datos incorrectos" })
    } else {
      const token = generateToken(user)
      res.json({ message: "Success", token })
    }
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

export default ctrl