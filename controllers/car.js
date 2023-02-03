import { Car } from '../schema/Car.js'
import { validationPostPut } from '../helpers/validationPost.js'
import { randomIndex } from '../helpers/randomItem.js'
import fs from 'fs'
import path from 'path'
import { response } from 'express'

export const upFile = (req, res) => {
  const file = req.file.originalname
  const fileExt = file.split('.')[1]
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      mensaje: 'fichero incompleto'
    })
  }

  if (fileExt !== 'png' && fileExt !== 'jpg' && fileExt !== 'jpeg' && fileExt !== 'gif') {
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: error,
        mensaje: 'Imagen invalida'
      })
    })
  } else {
    // const itemId = req.params.id
    // Car.findOneAndUpdate({ _id: itemId }, { image: req.file.filename }, { new: true }, (error, itemUpdate) => {
    // const search = Car.find(req.query)
    const itemId = req.params.id
    Car.findOneAndUpdate({ _id: itemId }, { image: req.file.filename }, { new: true }, (error, itemUpdate) => {
      if (error | !itemUpdate) {
        return res.status(500).json({
          status: 'error',
          mensaje: 'Error al actualizar'
        })
      }
      return res.status(200).json({
        status: 'success',
        item: itemUpdate,
        file: req.file
      })
    })
  }
}
// Pte revisar validación archivos y sacarlo a un helper
// Pte fileExt si tiene varios puntos xx.org.jpg seleccionar último
// Busqueda y seleccionar solo uno

export const listItems = (req, res) => {
  // let search = car.find({}, (error, items) => { })
  const search = Car.find(req.query)
  if (req.params.last && Number.isInteger(+req.params.last)) {
    search.limit(req.params.last)
  }

  // showFile
  // if (req.query.showFile) {
  //   console.log(req.query, req.query.showFile)
  //   search.countDocuments({})
  //   const countDocs = count
  //   console.log(countDocs)
  //   // search.countDocuments({}).exec((err, count) => {
  //   //   if (err) {
  //   //     return console.log(err)
  //   //   }
  //   //   const countDocs = count
  //   //   console.log(countDocs)
  //   // })
  // }

  // if (req.query) { // no es necesario, si no existe, devuelve un objeto vacio y busca todos
  //   console.log('puesss...', req.query)
  //   search.find(req.query)
  // }

  search.sort({ maker: 1 })
    .exec((error, items) => {
      if (error || !items) {
        return res.status(404).json({
          status: 'error',
          mensaje: 'No se han encontrado resultados'
        })
      }
      return res.status(200).send({
        status: 'success',
        mensaje: '¡Consulta finalizada con exito!',
        total: items.length,
        query: req.query,
        params: req.params,
        items
      })
    })
}
// .sort({ maker: -1 })
// date: -1 de fecha actual hacia atrás, 1 de la primera fecha a la actualidad, por defecto
// maker: 1 Es un campo string ordena alfabéticamente -1 empezando desde la z
// string a number =>  +'444' = 444 o '333'*1 = 333 y tb '2'/1 = 2 '9'-0

export const addCar = (req, res) => {
  // Recoger datos por post de formulario, ... parameters/requirements
  const parameters = req.body

  // Validar datos, Validator
  try {
    validationPostPut(parameters)
  } catch (error) {
    return res.status(400).json({
      status: error,
      mensaje: 'Faltan datos por enviar'
    })
  }

  // Crear objeto a guardar
  const car = new Car(parameters)

  // Asignar valores al objeto basado en el modelo (manual/auto)
  // car.date = parameters.date // Esto uno a uno

  // guardar el objeto en la BD
  car.save((error, carItem) => {
    if (error || !carItem) {
      return res.status(400).json({
        status: 'error',
        mensaje: 'No se ha guardado el item'
      })
    }
    return res.status(200).json({
      car: carItem,
      mensaje: 'Articulo guardado con exito'

    })
  })
}

export const randomItem = (req, res) => {
  const searchToCount = Car.countDocuments({})
  // count is deprecated => estimatedDocumentCount or countDocuments
  searchToCount.exec((err, count) => {
    if (err) {
      return console.log(err)
    }
    const countDocs = count
    console.log(countDocs)
    const search = Car.find(req.query) // ver si se puede quitar y 129 desde origen arriba con count

    const randomDoc = randomIndex(0, (countDocs - 1))
    search.findOne().skip(randomDoc)
      .exec((error, items) => {
        if (error || !items) {
          return res.status(404).json({
            status: 'error',
            mensaje: 'No se han encontrado resultados'
          })
        }
        return res.status(200).send({
          status: 'success',
          mensaje: '¡Resultado random!',
          total: items.length,
          random: randomDoc,
          items
        })
      })
  })
}

// An image file searched by the filename parameter is displayed.
export const showFile = (req, res) => {
  const file = req.params.file
  const pathFile = `./img/cars/${file}`
  fs.stat(pathFile, (error, isTrue) => {
    if (isTrue) {
      return res.sendFile(path.resolve(pathFile))
    } else {
      return res.status(404).json({
        status: error,
        mensaje: 'Error en imagen',
        file,
        pathFile
      })
    }
  })
}

// Pte ver si es posible integrarlo en listItems

export const search = (req, res) => {
  const search = req.params.search

  Car.find({
    $or: [
      { maker: { $regex: search, $options: 'i' } }, // Espresión regular mediante patrón regex
      { model: { $regex: search, $options: 'i' } }
    ]
  })
    .sort({ date: -1 })
    .exec((err, items) => {
      if (err || !items) {
        return response.status(404).json({
          status: 'error',
          mensaje: 'No tenemos resultados'
        })
      }
      return res.status(200).json({
        status: 'success',
        items
      })
    })
}
