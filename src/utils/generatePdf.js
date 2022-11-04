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

const printGradTit = (data) => {
  if (data.includes("BACHILLER")) {
    return "GRADO ACADÉMICO DE BACHILLER UNIVERSITARIO en"
  } else if (data.includes("MAESTRIA")) {
    return "GRADO ACADÉMICO DE MAESTRO en"
  } else {
    return "GRADO"
  }
}

const printEst1 = (data) => {
  return (data.split("EN ")[1])
}

const generatePdf = (data, res, prev) => {
  //  Datos a usar en el diploma
  const {
    RESO_NUM,
    FEC_RESO_CU,
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
  const doc = new PDF({ size: 'A4', autoFirstPage: false })

  doc.pipe(res)

  //  Cara delantera
  doc.addPage({ margin: 55 })
//  doc.image('public/formato.jpg', 0, 0, { width: doc.page.width, height: doc.page.height })
//  doc.image('public/formato_vacio.jpg', 0, 0, { width: doc.page.width, height: doc.page.height })

  if (prev == true) {
//    doc.image('public/formato.jpg', 0, 0, { width: doc.page.width, height: doc.page.height })
  }

  doc.moveDown(21)
    //  Fecha y número de resolución de consejo universitario
    doc
      .font('public/fonts/upcli.ttf', 18)
      .text(FEC_RESO_CU.split('/')[0] + ' DE ' + 
            getMonth(FEC_RESO_CU.split('/')[1]) + ' DEL ' + 
            FEC_RESO_CU.split('/')[2] +
            ' (RES. N° '+ RESO_NUM +')', 
        {
          align: 'right'
        })
      .moveDown(0.5)
    //  Tipo de grado (bachiller, título, maestría, etc)
    doc
      .font('public/fonts/upcli.ttf', 23)
      .text(printGradTit(DEN_GRAD), {
        align: 'center'
      })
      .moveDown(0.1)
    //  Denominación del grado
    doc
      .font('public/fonts/upcli.ttf', 23)
      .text(printEst1(DEN_GRAD), {
        align: 'center'
      })
      .moveDown(0.65)
    //  Datos del egresado
    doc
      .font('public/fonts/upcli.ttf', 28)
      .text(APEPAT + ' ' + APEMAT, {
        align: 'center'
      })
      .moveDown(-0.1)
    doc
      .text(NOMBRE, {
        align: 'center'
      })
      .moveDown(1.4)
    //  Facultad (en caso de que no sea posgrado)
    doc
      .font('public/fonts/upcli.ttf', 23)
      .text(FAC_NOM, {
        align: 'center'
      })
      .moveDown(1.5)
    //  Consejo de facultad o escuela, las posiciones de los valores de las fechas varían
    doc
      .font('public/fonts/upcli.ttf', 18)
      .text(F_FEC_CON_FAC_ESC.split('/')[0] + ' DE ' +
            getMonth(F_FEC_CON_FAC_ESC.split('/')[1]) + ' DEL ' +
            F_FEC_CON_FAC_ESC.split('/')[2], 105, 544)
    //  Fecha del diploma, posición variada
    doc
      .text(DIPL_FEC.split('/')[0] + ' DE ' + 
            getMonth(DIPL_FEC.split('/')[1]) + ' DEL ' +
            DIPL_FEC.split('/')[2], 265, 607)

  //  Fin del documento
  doc.end()
}

export { deleteEmptyRows, getDataFromExcel, generatePdf }
