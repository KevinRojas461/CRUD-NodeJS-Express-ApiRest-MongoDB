// por defecto todo en *
import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  // produccion
  'https://movies.com'
]

// sin *
// const corsMiddleware = () =>
// crear un funcion que al ejecutarla () me devuelva la funcionalidad de cors
// la funcion toma como parametro a acceptedOrigins pero
// por defecto tiene a ACCEPTED_ORIGINS

// { acceptedOrigins = ACCEPTED_ORIGINS } = {}
// quiere decir que se guarde en un objeto vacion {}
// el parametro que se le pasa
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    // si incluye el origen
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    // si no incluye el origen o es un orgigen diferente al de la lista igual deja
    if (!origin) {
      return callback(null, true)
    }

    // sin guna de las opciones anteriores error
    return callback(new Error('Not allowed by CORS'))
  }
})
