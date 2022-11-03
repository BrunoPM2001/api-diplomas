import { PrismaClient } from '@prisma/client'
import { promisify } from 'util'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { deleteEmptyRows, getDataFromExcel, generatePdf } from '../utils/generatePdf.js'
import { cleanExcelPadron } from '../utils/cleanerPadron.js'

const prisma = new PrismaClient()
const unlinkAsync = promisify(fs.unlink)
const ctrl = {}

ctrl.getAll = (req, res) => {
  try {
    jwt.verify(req.header("Authorization"), process.env.JWT_KEY, async (error, user) => {
      if (error) {
        res.json({ message: "Fail", detail: "Token inválido" })
      } else {
        const padrones = await prisma.padrones.findMany()
        res.json({ message: "Success", padrones })
      }
    })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.getOne = (req, res) => {
  try {
    jwt.verify(req.header("Authorization"), process.env.JWT_KEY, async (error, user) => {
      if (error) {
        res.json({ message: "Fail", detail: "Token inválido" })
      } else {
        const {
          registro
        } = req.query
        const padron = await prisma.padrones.findUnique({
          where: {
            REG_REGISTRO: registro
          }
        })
        res.json({ message: "Success", padron })
      }
    })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

ctrl.generate = (req, res) => {
  try {
    jwt.verify(req.header("Authorization"), process.env.JWT_KEY, async (error, user) => {
      if (error) {
        res.json({ message: "Fail", detail: "Token inválido" })
      } else {
        const file = req.file
        if (file == undefined) {
          res.json({ message: "Fail", detail: "No se ha seleccionado ningún archivo" })
        } else {
          //  Obtener el archivo subido y la data
          await deleteEmptyRows(req.file.path)
          const data = await getDataFromExcel(req.file.path)
          //  Eliminar archivo del servidor
          await unlinkAsync(req.file.path)
          //  Eliminar atributos innecesarios del padrón
          const newData = cleanExcelPadron(data, user.dni)
          const padrones = await prisma.padrones.createMany({
            data: newData,
            skipDuplicates: true
          })
          res.json({ message: "Success", detail: "Se han registrado " + padrones.count + " nuevos padrones"  })
        }
      }
    })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}
ctrl.previsualizarDiplomaSegunPadron = async (req, res) => {
  try {
    const file = req.file
    //  Verificar que el archivo se haya cargado
    if (file == undefined) {
      res.json({ message: "Fail", detail: "No se ha seleccionado ningún archivo" })
    } else {
      //  Obtener el archivo subido y la data
      await deleteEmptyRows(req.file.path)
      const data = await getDataFromExcel(req.file.path)
      //  Eliminar archivo del servidor
      await unlinkAsync(req.file.path)
      //  Cabecera de la respuesta y generación del pdf
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=diploma.pdf'
      })
      generatePdf(data[0], res)
    }
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

export default ctrl
