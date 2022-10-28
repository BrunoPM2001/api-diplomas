import { promisify } from 'util'
import fs from 'fs'
import { deleteEmptyRows, getDataFromExcel, generatePdf } from '../utils/generatePdf.js'

const unlinkAsync = promisify(fs.unlink)
const ctrl = {}

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
