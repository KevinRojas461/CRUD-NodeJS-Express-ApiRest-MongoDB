// zod
import z from 'zod'

// manera mas rapida de hacer validaciones con zod
// movieSchema representa el objeto de la pli
// movieSchema = todo el esquema de validaciones
const movieSchema = z.object({
  // le decimos que el title es un string
  title: z.string({
    // si no es string imprime un mensaje de error
    invalid_type_error: 'Movie title must be a string',
    // si el titulo es obligatorio y no lo ponen manda mensaje de error
    required_error: 'Movie title is required'
  }),
  // validaciones en cadena = que sea un numero y que sea entero
  // .int().positive() positivo
  // el año tiene que estar entre 1900 y 2024 y ese rango ya se asegura de que
  // el numero que pongan sea positivo es decir no es necesario positive
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  // las puntuaciones del 0 al 10
  // si no lo colocan por defecto es 5 es decir es opcional
  rate: z.number().min(0).max(10).default(5),
  // que el poster sea una direccion "URL" de una imagen
  // url().endsWith('.jpg') que la url temine en .jpg
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  // podria ser esto: z.array(z.string()) pero no puede ser un numero
  // ilimitado de string existen una cantidad de generos de plis
  genre: z.array(
    // que tiene que ser una lista de solo estos generos:
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama',
      'Crime', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum Genre.'
    }
  )
})

// funcion que se le pasa el objeto (input) que se quiere crear
export function validateMovie (input) {
  // movieSchema dice si hubo un error en caso de que no se cumplan las condiciones
  // o el objeto con todos los datos correctos
  // safeParsearse devulve un objeto que te va a decir si hay un error
  // o si hay datos
  return movieSchema.safeParse(input)
}

// para evitar inicializar los atributos y asignarle los nuevos valores en app.js
// o actualizar lo atributos del objeto en app.patch('/movies/:id')
// y para que pueda modificar todo o solo un atributo o algunos atributos
// --aqui le manda los datos que quieren modificar en input
export function validatePartialMovie (input) {
  // partial lo que hace es que toda y cada uno de los atributos
  // o propiedades van a ser "opcionales" a la hora de actualizar aunque a la
  // hora de crear si sen obligatorios todos de forma que si no esta no pasa nada
  // pero si no esta la valida como se supone que la tiene que validar
  // ---es decir que cuando se vaya a uctualizar valide solo los datos nuevos
  // en caso que se quiera actulizar solo un atributo o dos y no todos
  // asi no haya ningun error por datoa obligatorios al momento de crear
  // solo valide los datos que voy a actulizar o todos a la vez
  return movieSchema.partial().safeParse(input)
}
// en vez de usar module.exports le ponemos export a cada funcion
// module.exports = {
//   validateMovie,
//   validatePartialMovie
// }
