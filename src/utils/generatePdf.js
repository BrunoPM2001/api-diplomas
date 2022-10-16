import xlsx from 'xlsx'

const getDataFromExcel = (path) => {
  const excel = xlsx.readFile(path)
  const data = xlsx.utils.sheet_to_json(excel.Sheets[process.env.SHEET_NAME])
  return data
}

const generatePdf = (data) => {
  return 0
}

export { getDataFromExcel, generatePdf }
