import { Mongo } from './database/mongo.js'
import express, { json, urlencoded } from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import { routes } from './routes/car.js'
// import * as dotenv from 'dotenv' // nos sirve con el de mongo.js
// dotenv.config()

console.log('hola como vas, tron!')

Mongo()

const app = express()

app.use(cors())
app.use(json()) // recibe datos con content-type app/json
app.use(urlencoded({ extended: true })) // recibe form-urlencode

routes.forEach(element => {
  app.use('/api', element)
})
// app.use('/api', getRouterNewCar)

const port = process.env.PORT || 5174
app.listen(port, () => {
  console.log('conectado....', process.env.PORT)
})
