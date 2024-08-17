// i movies, { filter, find, push, findIndex, splice } ir buscando y movies.filter etc
// en el futuro se hara con with
// import movies from './movies.json' with { type: "json" }
import { readJSON } from '../../utils.js'
// para poner ids automaticamente a la hora de crear nuevas pelis
import { randomUUID } from 'node:crypto'
const movies = readJSON('./movies.json')

export class MovieModel {
  // estos metodos son como los services HorasExtraRepository
  // vamos a tener diferentes metodos estaticos
  // metodo getAll para recuperar todas las peliculas
  // y que se le puedan pasar filtros (genre) al metodo
  // async que sirva para todo
  static async getAll ({ genre }) {
    // ----si tenemos genero como parametro ?genre=Action
    if (genre) {
      // const filterMovies = movies.filter
      return movies.filter(
      // filtrar y ver si movie.genre incluye el genero que le estamos pasando
      // movie => movie.genre.includes(genre)
      // el problema de includes es que si es genre=Action nos da las pelis
      // de accion pero si le damos genre=action no nos da nada

        // vamos a asegurarnos que hacemos la comparacion de los
        // generos "todo en minuscula"
        // es decir sacamos el gerero del json bd y lo pasamos a minuscula
        // y igual el genero que le pasamos en el URL tambien lo pasamos a minuscula
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
      // ya no se responde al usuario con un json en caso
      // de que se pasen parametros para el filtro
      // return res.json(filterMovies)
    }
    // ya no se responde las peliculas directamente al usuario
    // en caso de que no se pasen pasen parametros para el filtro
    // res.json(movies)

    // ahora solo se envian los datos en bits para que luego los terminen
    // de procesar
    return movies
  }

  //
  static async getById ({ id }) {
    // encontar la pelicula
    // recuperar la peli y que busque si hay un id igual al que puse
    // en la URL /:id en los ids de las pelis
    const movie = movies.find(movie => movie.id === id)
    // y si la encontramos la devolvemos
    return movie
  }

  // input es un objeto
  static async create (input) {
    // creamos un objeto aunque deberia ser en bd
  // en base de datos
    const newMovie = {
      id: randomUUID(), // uuid v4
      // vamos a tener todos los datos que hemos validado
      // no es lo mismo result.data que req.bdy
      // en uno tenemos los datos validos que sean como se espera
      // y en el otro no sabemos lo que nos pueden meter

      // le pasamos los atributos del objeto
      ...input
      // rate es opcional y 0 por defecto si no viene el valor
      // rate: rate ?? 0,
      // poster

    }

    // Esto no seria REST, porque estamos guardando
    // el estado de la aplicacion en memoria no en una bd
    // es decir que guarda en el movies.json
    movies.push(newMovie)

    // devolvemos el newMovie
    return newMovie
  }

  // para borrar
  // lle estoy pasando el id en objeto {}
  // para facilitar pasarle mas varibles en un futuro
  // y en javaScript es mas recomendado usar {}
  static async delete ({ id }) {
    // recuperamos el indice
    // find: Devuelve el primer elemento que cumple con la condición proporcionada.
    // ejp: [5, 12, 8, 130, 44] array.find(element => element > 10)
    // 12 (el primer elemento mayor que 10)
    // Devuelve el índice del primer elemento que cumple
    // con la condición proporcionada. findIndex(element => element > 10)
    // 1 (el índice del primer elemento mayor que 10)
    const movieIndex = movies.findIndex(movie => movie.id === id)

    // Devuelve el índice del primer elemento que cumple con la condición.
    // Si ningún elemento cumple con la condición, devuelve -1.
    // [5, 12, 8, 130, 44...] indices = [0, 1, 2, 3, 4, 5]
    if (movieIndex === -1) return false

    // para modificar
    // Elimina un elemento en la posición movieIndex del array movies.
    // Cuando llamas a splice con dos argumentos, como en movies.splice(movieIndex, 1),
    // estás eliminando elementos del array.
    movies.splice(movieIndex, 1)
    return true
  }

  // { id, input }
  // pasarle el id y el/los atrubutos del objeto que se quiere actualizar
  static async update ({ id, input }) {
    // const movie = movies.find(movie => movie.id === id)
    // ---en vez de find se usa el findIndex
    // en una sola operacion tengo el "indice" que lo podre utilizar para actualizar
    // y ademas puedo saber si esta o no esta la pelicula
    const movieIndex = movies.findIndex(movie => movie.id === id)

    // Si no encontramos la pelicula en movies.json error
    // si el movieIndex es -1 significa que no esta esa peli con esa id
    if (movieIndex === -1) return false

    // actualizar los datos de la pelicula
    movies[movieIndex] = {
      // todo lo que tenemos en movieIndex la peli de movies.json
      ...movies[movieIndex],
      // y los nuevos datos que hemos validado
      // o los datos que nos ha pasado nuestro usuario
      ...input
    }

    // vamos a emviar los datos nuevos junto con los datos viejos
    return movies[movieIndex]
  }
}
