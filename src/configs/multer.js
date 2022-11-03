import multer from 'multer'

const storage = multer.diskStorage({
  destination: "public/tmpFiles",
  filename: (req, file, cb) => {
    cb(null, 'padron.xlsx')
  }
})

const uploadConfig = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "application/vnd.ms-excel" || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      cb(null, true) 
    } else {
      cb(new Error ('El archivo no es del tipo adecuado'))
    }
  }
}).single('File')

const upload = (req, res, next) => {
  try {
    uploadConfig(req, res, (err) => {
      if (err) {
        res.json({ message: "Fail", detail: "Error en la carga del padrón" })
      } else {
        next()
      }
    })
  } catch (e) {
    res.json({ message: "Fail", detail: "Exception" })
  }
}

export default upload
