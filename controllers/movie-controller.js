// repo y el modelo al mismo tiempo
// import { MovieModel } from '../models/local-file-system/movie-model.js'
import { MovieModel } from '../models/database/movie-model.js'
// import { validateMovie, validatePartialMovie } from './schemas/movies'
// es "obligatoria" la extencion en "mjs" (./schemas/movies.js) y en cjs no
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

// el controlar es el que le responde lo que necesita o lo que le pida
// el usuario
// mientras el repo y ser le da las herramientas para responder
export class MovieController {
  // async para que el metodo sea asincrono
  static async getAll (req, res) {
    // try catch para controlar errores
    // si hay un async await hay que manejar los errores
    // pero para no tener que hacer un try uno por uno usamos un middleware

    // recuperar el parametro de la URL para el filtro
    const { genre } = req.query
    // vamos a llamar el metodo MovieModel.getAll para recuperar o traer todas
    // las peliculas de la bd y le pasamos el genre como parametro para filtar por genre
    // devuleve las pelis y se guardan en const movies
    // await para que el metodo trabaje de forma asincrona
    // await que sirva para todo
    const movies = await MovieModel.getAll({ genre })

    // mostar la info que esta en la ruta /movies
    // ---- mostar los datos de movies.json en formato json
    // const movies = readJSON('./movies.json')
    // que es lo que renderiza
    res.json(movies)
  }

  //
  static async getById (req, res) {
    // path-to-regexp =
    // app.get(/.*dev$/,) = todo lo que termina con dev = mandev,endev
    // /.*dev$/ esa ruta funcionaria y con todas las rutas que terminen en dev
    // pues entraria

    // '/movies/:id/:mas/:otro' = const { id, mas, otro }
    const { id } = req.params
    // le pasamos el id de la URL al metodo getById para que busque la peli
    const movie = await MovieModel.getById({ id })
    // si se encuentra el id que puse en la url
    // devolvemos un json con la info de la pelicula con el id que pusimos en la URL
    if (movie) return res.json(movie)

    // 400-499 pide algo que el server no puede hacer
    // y si no se encuentra ninguna peli con el id que pusimos en la URL
    // le informamos al usuario que no se encontro la peli
    res.status(404).json({ message: 'Movie not found' })
  }

  //
  static async create (req, res) {
    // sin zod
    // recuperar los atributos de la peli
    // y todo lo vamos a recuperar de req.body
    // es decir de el objeto con sus atributos que pusieron en la URL
    // es la informacion que bendria enviada por el usuario
    // const {
    //   title,
    //   genre,
    //   year,
    //   director,
    //   duration,
    //   rate,
    //   poster
    // } = req.body

    // "validar" el req.body y al validar ya se inicializan los atributos del obj
    const result = validateMovie(req.body)
    // si el resultado a tenido un error result.error
    // si no ha sido satisfactorio
    if (!result.success) {
    // muestra el error de la validacion
    // 400 que el cliente ha hecho algo para que se cometa el error
    // no puso los datos bien o la sintaxis esta mal
    // en este caso hay que convertir a JSON el error
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    // -----la manera antigua de validar
    // Es para validar que pongan todos los datos
    // que no permita crear si los datos no estan bien digitados
    // if (!title || !genre || !year || !director || !duration) {
    //   return res.status(400).json({ message: 'Missing required field' })
    // }
    // // es para validar que pongan un numero entero en year
    // if (typeof year !== 'number') {
    //   return res.status(400).json({ message: 'Year must be a number' })
    // }

    // vamos a tener todos los datos que hemos validado
    // no es lo mismo result.data que req.bdy
    // en uno tenemos los datos validos que sean como se espera
    // y en el otro no sabemos lo que nos pueden meter
    // le pasamos los datos validatos para que los guarde en la db
    const newMovie = await MovieModel.create({ input: result.data })

    // el estado correcto para crear un recurso es el 201 (creado)
    // .json(newMovie) devolver el recurso que se creo para
    // actualizar la cache del cliente es decir que muestra el movies.json
    res.status(201).json(newMovie)
  }

  //
  static async delete (req, res) {
    // sin dependencia cors
    // recuperar el origin del header del nav
    // --el origen que trata de sacar datos de mi api
    // const origin = req.header('origin')
    // el nav nunca envia el origin cuando la peticion es del mismo origen
    // es decir http://localhost:1234 pide recursos de http://localhost:1234
    // su propio origen siempre esta disponible te pides a ti mismo
    // !origin = en caso de que me estoy pidiendo a mi mismo
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //   res.header('Access-Control-Allow-Origin', origin)
    // }

    // recuperamos el id de la URL
    const { id } = req.params

    // pasarle el id de la URL al metodo delete
    // y guardar el resultado en result
    const result = await MovieModel.delete({ id })

    // si el resultado es false es porque no se encontro la peli
    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    // mensaje para avisar que se borro exitosamente
    return res.json({ message: 'Movie deleted' })
  }

  static async update (req, res) {
    // y ya tendriamos el resultado
    const result = validatePartialMovie(req.body)

    // si hubo un error al actualizar pq los datos nuevos estaban mal a algo asi
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    // recuperamos la id de la URL
    // el id es un parametro no un objeto
    const { id } = req.params

    // le pasamos el id de la URL y le pasamos
    // result.data que son el/los atributos de la URL
    // que el usuario envio para que el objeto se actualize
    const updateMovie = await MovieModel.update({ id, input: result.data })

    // buscar la peli por el id

    // y devolvemos el json de la pli actualizada
    return res.json(updateMovie)
  }
}
