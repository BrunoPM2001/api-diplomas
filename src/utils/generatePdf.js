import Excel from 'exceljs'
import xlsx from 'xlsx'
import PDF from 'pdfkit'

//  Convertir un número de mes a mes escrito en letras
const getMonth = (number) => {
  const date = new Date()
  date.setMonth(number - 1)
  return date.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase()
}

const deleteEmptyRows = async (path) => {
  //  Leer archivo en excel para modificarlo
  const workbook = new Excel.Workbook()
  await workbook.xlsx.readFile(path)
  const sheet = workbook.worksheets[0]

  //  Eliminar celdas innecesarias
  while (sheet.getCell('A1').value == null) {
    sheet.spliceRows(1, 1)
  }

  //  Sobreescribir archivo luego de modificarlo
  await workbook.xlsx.writeFile(path)
}

const getDataFromExcel = async (path) => {
  //  Leer hoja de excel y generar json según la tabla
  const worksheet = xlsx.readFile(path).Sheets[process.env.SHEET_NAME]
  const excelData = xlsx.utils.sheet_to_json(worksheet)
  return excelData
}

const generatePdf = (data, res) => {
  //  Cabecera de la respuesta para generar un pdf

  //  Datos a usar en el diploma
  const {
    RESO_NUM,
    FEC_RESO_CU,
    GRAD_TITU,
    MOD_OBT,
    DEN_GRAD,
    APEPAT,
    APEMAT,
    NOMBRE,
    FAC_NOM,
    F_FEC_CON_FAC_ESC,
    DIPL_FEC
  } = data
  
  //  Generación del PDF del diploma
  const doc = new PDF()
  doc.pipe(res)

  //  Cara delantera
  doc.moveDown(15)
    //  Fecha y número de resolución de consejo universitario
    doc
      .font('Times-Bold', 13)
      .text(FEC_RESO_CU.split('/')[0] + ' DE ' + 
            getMonth(FEC_RESO_CU.split('/')[1]) + ' DEL ' + 
            FEC_RESO_CU.split('/')[2] +
            ' (RES. N° '+ RESO_NUM +')', 
        {
          align: 'right'
        })
      .moveDown(3.75)
    //  Tipo de grado (bachiller, título, maestría, etc)
    doc
      .font('Times-Bold', 13)
      .text(GRAD_TITU, {
        align: 'center'
      })
      .moveDown(1.5)
    //  Denominación del grado
    doc
      .font('Times-Bold', 13)
      .text(DEN_GRAD, {
        align: 'center'
      })
      .moveDown(1.5)
    //  Datos del egresado
    doc
      .font('Times-Bold', 13)
      .text(APEPAT + ' ' + APEMAT + ' ' + NOMBRE, {
        align: 'center'
      })
      .moveDown(2.75)
    //  Facultad (en caso de que no sea posgrado)
    doc
      .font('Times-Bold', 13)
      .text(FAC_NOM, {
        align: 'center'
      })
      .moveDown(1.5)
    //  Consejo de facultad o escuela, las posiciones de los valores de las fechas varían
    doc
      .font('Times-Bold', 13)
      .text(F_FEC_CON_FAC_ESC.split('/')[0] + ' DE ' +
            getMonth(F_FEC_CON_FAC_ESC.split('/')[1]) + ' DEL ' +
            F_FEC_CON_FAC_ESC.split('/')[2], 110, 522)
    //  Fecha del diploma, posición variada
    doc
      .text(DIPL_FEC.split('/')[0], 300, 597)
      .text(getMonth(DIPL_FEC.split('/')[1]), 300, 597)
      .text(DIPL_FEC.split('/')[2], 300, 597)

  doc.end()
}

export { deleteEmptyRows, getDataFromExcel, generatePdf }
