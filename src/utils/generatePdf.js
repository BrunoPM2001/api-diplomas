import Excel from 'exceljs'
import xlsx from 'xlsx'
import PDF from 'pdfkit'

// Altura inicial del diploma en la primera cara
const altura = 260

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
    DEN_GRAD,
    APEPAT,
    APEMAT,
    NOMBRE,
    FAC_NOM,
    F_FEC_CON_FAC_ESC,
    DIPL_FEC,
    COD_UNIV,
    DOCU_TIP,
    DOCU_NUM,
    ABRE_GYT,
    MOD_OBT,
    MOD_EST,
    RESO_FEC,
    DIPL_TIP_EMI,
    REG_LIBRO,
    REG_FOLIO
  } = data
  
  //  Generación del PDF del diploma
  const doc = new PDF({ size: 'A4', autoFirstPage: false })

  doc.pipe(res)

  //  Cara delantera
  doc.addPage({ margins: { left: 40, right: 40, top: 60, bottom: 5 } })
//  doc.image('public/formato.jpg', 0, 0, { width: doc.page.width, height: doc.page.height })
//  doc.image('public/formato_vacio.jpg', 0, 0, { width: doc.page.width, height: doc.page.height })

  if (prev == true) {
//    doc.image('public/formato.jpg', 0, 0, { width: doc.page.width, height: doc.page.height })
  }
  doc.fillColor('#222222')

  //  Texto fijo:
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Por cuanto:", 48, altura + 50)
    
  //  Fecha y número de resolución de consejo universitario
  doc
    .text("El Consejo Universitario en sesión de fecha", 48, altura + 70)
    .font('public/fonts/upcli.ttf', 18)
    .text(FEC_RESO_CU.split('/')[0] + ' DE ' + 
          getMonth(FEC_RESO_CU.split('/')[1]) + ' DEL ' + 
          FEC_RESO_CU.split('/')[2] +
          ' (RES. N° '+ RESO_NUM +')', 
    {
      align: 'right',
      characterSpacing: -0.35,
      wordSpacing: -0.5,
    }, altura + 68)
  
  
  //  Tipo de grado (bachiller, título, maestría, etc) y denominación del grado
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("acordó conferir el", 48, altura + 95)
    .font('public/fonts/upcli.ttf', 23)
    .text(printGradTit(DEN_GRAD), 140, altura + 90)

    .text("", 48, altura + 95)
    .text(printEst1(DEN_GRAD), {
      align: 'center'
    }, altura + 115)

  //  Datos del egresado
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("A don (doña)", 48, altura + 160)
    .font('public/fonts/upcli.ttf', 28)
    .text(APEPAT + ' ' + APEMAT, {
      align: 'center'
    }, altura + 153)
    .text(NOMBRE, {
      align: 'center'
    })

  //  Facultad (en caso de que no sea posgrado)
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("de conformidad con lo aprobado por el Consejo de la Facultad de", 48, altura + 225)
    .font('public/fonts/upcli.ttf', 23)
    .text(FAC_NOM, {
      align: 'center'
    }, altura + 245)

  //  Consejo de facultad o escuela, las posiciones de los valores de las fechas varían
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("con fecha", 48, altura + 275)
    .font('public/fonts/upcli.ttf', 18)
    .text(F_FEC_CON_FAC_ESC.split('/')[0] + ' DE ' +
        getMonth(F_FEC_CON_FAC_ESC.split('/')[1]) + ' DEL ' +
        F_FEC_CON_FAC_ESC.split('/')[2], 95, altura + 273)
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Por tanto:", 48, altura + 300)

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Le expide el presente Diploma para que se le reconozca como tal.", 48, altura + 320)

  //  Fecha del diploma, posición variada
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Dado y firmado en La Cantuta - Chosica,", 48, altura + 340)
    .font('public/fonts/upcli.ttf', 18)
    .text(DIPL_FEC.split('/')[0] + ' DE ' + 
      getMonth(DIPL_FEC.split('/')[1]) + ' DEL ' +
      DIPL_FEC.split('/')[2], 243, altura + 338)

  //  Firmas de autoridades actuales
  doc.lineWidth(0.25)
  doc.rect(48, 690, 163, 0.5).stroke('#222222')
  doc.rect(416, 690, 150, 0.5).stroke('#222222')
  doc.rect(233, 737, 150, 0.5).stroke('#222222')

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Dra. Lida Violeta Asencios Trujillo", 48, altura + 435)
    .text("Rectora", 108, altura + 447)
    .text("Dra. Rubén José Mora Santiago", {
      align: 'right'      
    }, altura + 435)
    .text("Decano", 475, altura + 447)
    .text("", 48, 480)
    .text("Mtra. Anita Luz Chacón Ayala", {
      align: 'center'
    }, altura + 480)
    .text("Secretaria general (e)", 260, altura + 493)


  doc.addPage({ margins: { left: 45, right: 45, top: 55, bottom: 45 } })

  doc.fillColor('#222222')
  //  Segunda cara
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Código de la universidad:", 48, 48)
    .font('public/fonts/upcli.ttf', 13)
    .text(COD_UNIV, 168, 49)

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Tipo de documento:", 48, 68)
    .font('public/fonts/upcli.ttf', 13)
    .text(DOCU_TIP, 142, 69)
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("N°:", 160, 68)
    .font('public/fonts/upcli.ttf', 13)
    .text(DOCU_NUM, 182, 69)

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Abreviatura de grado: ", 48, 88)
    .font('public/fonts/upcli.ttf', 13)
    .text(ABRE_GYT, 152, 89)

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("El grado lo obtuvo por: ", 48, 108)
    .font('public/fonts/upcli.ttf', 13)
    .text(MOD_OBT, 158, 109)

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Modalidad de estudios: ", 48, 128)
    .font('public/fonts/upcli.ttf', 13)
    .text(MOD_EST, 160, 129)
  
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Número de resolución: ", 48, 148)
    .font('public/fonts/upcli.ttf', 13)
    .text(RESO_NUM, 152, 149)

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Fecha de resolución: ", 48, 168)
    .font('public/fonts/upcli.ttf', 13)
    .text(RESO_FEC, 145, 169)

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Tipo de emisión: ", 48, 188)
    .font('public/fonts/upcli.ttf', 13)
    .text(DIPL_TIP_EMI, 128, 189)

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Registrado en el libro: ", 48, 208)
    .font('public/fonts/upcli.ttf', 13)
    .text(REG_LIBRO, 152, 209)

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Registrado en el folio: ", 48, 228)
    .font('public/fonts/upcli.ttf', 13)
    .text(REG_FOLIO, 152, 229)

  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Registrado de diploma: ", 48, 248)

  //  Firma de la directora de registro
  doc.lineWidth(0.25)
  doc.rect(48, 355, 223, 0.5).stroke('#222222')
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Directora de Registro y Servicios Académicos", 57, 365)

  //  Firma del interesado
  doc.lineWidth(0.25)
  doc.rect(48, 465, 223, 0.5).stroke('#222222')
  doc
    .font('public/fonts/mtcorsva.ttf', 13)
    .text("Interesado (a)", 127, 475)

  //  Fin del documento
  doc.end()
}

export { deleteEmptyRows, getDataFromExcel, generatePdf }