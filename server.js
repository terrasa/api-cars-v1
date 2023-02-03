import { connect } from 'mongoose'
// import { myRouter } from './routes/user.js'

import express, { json } from 'express'
import cors from 'cors'

import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(json)

// app.use('/api', myRouter)

app.get('/', (req, res) => {
  return res.status(200).send('welcom to my f API')
})

connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a Atlas')
    app.listen(process.env.PORT, () => {
      console.log('conectado....', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })
