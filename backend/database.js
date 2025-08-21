// Importo mongoose 
import mongoose from "mongoose";
// Importo el archivo config
import { config } from "./src/utils/config.js";
//1- Configurar la URI de la base de datos
// const URI = "mongodb://localhost:27017/ferreteriaEPA";
//2- Conecto la base de datos
mongoose.connect(config.db.URI);
// -------- Comprobar que todo funciona ----------
const connection = mongoose.connection;
//veo si funciona
connection.once("open", () => {
  console.log("Base de datos conectada");
});
//veo si se desconectó
connection.on("disconnected", () => {
  console.log("La base de datos se desconectó");
});
//veo si hay un error
connection.on("error", () => {
  console.log("Error al conectarse a la base de datos");
});