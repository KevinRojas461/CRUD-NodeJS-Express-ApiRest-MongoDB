// por ahora usar el require que es una funcion pq usa ()
// el () es que le estoy pasando un parametro a la funcion
import { createRequire } from 'node:module'
// import.meta.url direcccion del archivo actual
const require = createRequire(import.meta.url)
// el path es como un parametro que se le mandan los json
export const readJSON = (path) => require(path)
