// aqui no se usa ni head ni method ni end ni hay que convertir
// todo eso lo hace automatico

// lo primero que hay que g¿hacer para pasar de cjs a mjs es ir a package.json
// "main": "app.js", "type": "module",
// el "type" por defecto esta en "commonjs" require module.exports
// el "type": "module" es para usar mjs (import/export)
// "sin cambiar extenciones" (app.mjs) ... y bombilla
import express, { json } from 'express' // require -> commonJS

// importar las rutas
import { moviesRouter } from './routes/movie-routes.js'
// importar los origenes permitidos
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.disable('x-powered-by') // deshabilita el header express y no se sepa que se uso

// es un middleware de express
// que lo que hace es cacturar esa peticion y detectar si tiene que sacarle
// los datos de la URL para que puedas acceder al req.body y tener acceso
// al objeto que estamos enviando
app.use(json())

// usar los origenes permitidos
// pasarle los origenes como parametro de la funcion cors
// app.use(corsMiddleware({ acceptedOrigins: ['http://localhost:8080', 'http://localhost:1234'] }))

// por defecto la lista ACCEPTED_ORIGINS
// estamos llamando la funcion corsMiddleware
app.use(corsMiddleware())
// para que sea sin option
// sin Access-Control-Allow-Origin
// y sin Access-Control-Allow-Methods
// pone todas esa cabezeras automaticamente en TODOS los metodos
// pero por defecto todo en * (si a todos lo que quieran acceder a mis datos)
// app.use(cors()) => *

// sin cors
// lista con todos los origenes permitidos
// const ACCEPTED_ORIGINS = [
//   'http://localhost:8080',
//   'http://localhost:1234',
//   // produccion
//   'https://movies.com'
// ]

// cuando se haga el metodo get en la ruta /
// vamos a contestar o que se ejecute el metodo (callback)
// app.get('/', (req, res) => {
//   res.json({ message: 'hola mundo' })
// })

// ----------Todos los recursos que sean MOVIES se identifica con /movies
// lo que quiero es que mi aplicacion cuando accedo a /movies
// voy a cargar todas las rutas que tengo en moviesRouter
// separando totalmente todas las las rutas que tienen que ver con /movies
// la app piensa: cuando yo detecte que en la URL al entrar y hacer la peticion (req)
// hay un /movies me voy al moviesRouter (rutas)

// y sidentro del /movies hacen un get a / entonces respondo con la funcion get /
// y si dentro del /movies hacen un /:id entonces hago get /movies/:id etc
// le puden hacer un delete patch post a /movies
app.use('/movies', moviesRouter)
// metodos normales: GET/HEAD/POST
// metodos complejos: PUT/PATCH/DELETE

// sin la dependencia cors
// CORS PRE-FLIGHT
// cuando se hace una peticion utilizando PUT/PATCH/DELETE
// se requiere una peticion especial
// que se llama "OPTIONS"
// son como permisos para editar la info
// app.options('/movies/:id', (req, res) => {
//   // recuperar el origin del header del nav
//   // --el origen que trata de sacar datos de mi api
//   const origin = req.header('origin')
//   // el nav nunca envia el origin cuando la peticion es del mismo origen
//   // es decir http://localhost:1234 pide recursos de http://localhost:1234
//   // su propio origen siempre esta disponible te pides a ti mismo
//   // ---!origin = en caso de que me estoy pidiendo a mi mismo
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     // cabezera que le idique los metodos que puede utilizar tambien
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//   }
//   // enviar la respuesta
//   res.send(200)
// })

// vamos a escuchar el puerto del paramatro o sino por defecto el 1234
// EL PUERTO LO ESTA DANDO POR VARIABLE DE ENTORNO EL HOSTING
// por eso no se puede en produccion PORT = 1234
// porque eso lo asigna el servicio donde lo vamos a hospedar
const PORT = process.env.PORT ?? 1234

// que nuestra app escuche en este puerto
// es decir la app escuhce peticiones del puerto 1234
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
