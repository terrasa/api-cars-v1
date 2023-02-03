import { Schema, model } from 'mongoose'

export const carSchema = Schema({
  maker: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'default.png'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export const Car = model('Car', carSchema)
