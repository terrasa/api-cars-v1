import express from 'express'
import { addCar, listItems, upFile, randomItem, showFile } from '../controllers/car.js'
import multer from 'multer'

const router = express.Router()

const storageImg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/cars/')
  },
  filename: function (req, file, cb) {
    cb(null, 'item' + Date.now() + file.originalname)
  }

})

const upFiles = multer({ storage: storageImg })

export const routes = [
  router.get('/list_car/:last?', listItems),
  router.get('/random_car', randomItem),
  router.post('/list_car', addCar),
  router.post('/up_file/:id', [upFiles.single('file')], upFile),
  router.get('/show_file/:file?', showFile),
  router.get('/list_car/', showFile)

]

// En la ruta:
// localhost:3000/api/save_car
// 1º Se añaden para metros, tipo... localhost:3000/api/save_car/3   Indica last=3
// 2º Si se añaden solos los req.query... localhost:3000/api/save_car/?brand=BMW&brand=Ford
// 3ª Si además de params van queries... localhost:3000/api/save_car/3?brand=BMW&brand=Ford
// Siempre los para metros /2 y a continuación ?query=xxx&query=yyy&...
// Si no se añaden queries se saca el listado de todo.

// up-file => queda pte ver otro identificador en vez de Date.now()
//         => subir fichero multiples en vez de single...
//         => Guardar el archivo en vez de en local en la bd de mongodb...
