// enrrutador a partir del cual vamos a poder responder todos los peticiones
// rutas es decir controller api o api rest pero separando rutas y controllers
import { Router } from 'express'

import { MovieController } from '../controllers/movie-controller.js'

// sin el utils.js
// por ahora usar el require que es una funcion pq usa ()
// el () es que le estoy pasando un parametro a la funcion
// import { createRequire } from 'node:module'
// import.meta.url direcccion del archivo actual
// const require = createRequire(import.meta.url)
// const movies = require('./movies.json')

// con util.js
// import { readJSON } from './utils.js'
// const movies = readJSON('./movies.json')

// que todas las rutas que sean /movies van a responder a este ruter
export const moviesRouter = Router()

// Todos los recursos que sean MOVIES se identifica con /movies
// cuando en este router vaya a la raiz entonces repondemos con la funcion que
// hay aqui (MovieController.getAll)
// y si dentro del /movies hacen un get a / entonces respondo con todo esto:
// (MovieController.getAll)

// si dentro del /movies hacen un get en la ruta / entonces los envio
// al controlador (MovieController.getAll) para que responda la peticion req
moviesRouter.get('/', MovieController.getAll)

// y si dentro del /movies hacen un /:id entonces hago get /movies/:id
// si dentro del /movies hacen un get en la ruta /:id entonces los envio
// al controlador (MovieController.getById) para que responda la peticion req
moviesRouter.get('/:id', MovieController.getById)

moviesRouter.post('/', MovieController.create)

moviesRouter.delete('/:id', MovieController.delete)

moviesRouter.patch('/:id', MovieController.update)
