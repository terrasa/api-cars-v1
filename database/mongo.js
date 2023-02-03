import { connect } from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

export function Mongo () {
  connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Conectado a Atlas')
      // app.listen(process.env.PORT, () => {
      //   console.log('conectado....', process.env.PORT)
      // })
    })
    .catch((error) => {
      console.log(error)
    })
}
