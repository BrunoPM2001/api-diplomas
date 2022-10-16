import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import padronesRoutes from './src/routes/padrones.js'

const app = express()

//  Middlewares
app.use(express.json())
app.use(cors())

//  Rutas
app.use("/api/padrones", padronesRoutes)

app.listen(process.env.PORT || 3000, () => console.log("Listen to port 3000"))
