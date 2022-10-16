import fs from 'fs'
import { promisify } from 'util'
import { getDataFromExcel, generatePdf } from '../utils/generatePdf.js'

const unlinkAsync = promisify(fs.unlink)
const ctrl = {}

ctrl.generatePadron = async (req, res) => {
  try {
    if (file == undefined) {
      res.json({ message: "Fail", detail: "No se ha seleccionado ningún archivo" })
    } else {
      const data = await getDataFromExcel(req.file.path)
      await generatePdf(data)
      //  Eliminar archivo excel del servidor
      await unlinkAsync(req.file.path)
      res.json({ message: "Success", detail: "Diploma generado", ruta: "http..." })
    }
    await unlinkAsync(req.file.path)
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
  res.json({ message: "Method" })
}

export default ctrl
