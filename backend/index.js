// Importo el archivo app.js
import app from "./app.js";
// Importo el archivo database.js
import "./database.js";
// Importo el archivo config
import { config } from "./src/utils/config.js";
// Creo una función asincrona para que el servidor corra en el puerto 5000
async function main() {
  app.listen(config.server.PORT);
  // Muestro un mensaje en la consola para saber que el servidor está corriendo
  console.log("Server corriendo");
}
// Ejecuto la función main
main();