import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import padronesRoutes from './src/routes/padrones.js'
import usuariosRoutes from './src/routes/usuarios.js'

const app = express()

//  Middlewares
app.use(express.json())
app.use(cors())

//  Rutas
app.use("/api/padrones", padronesRoutes)
app.use("/api/usuarios", usuariosRoutes)

app.listen(process.env.PORT || 3000, () => console.log("Listen to port 3000"))
