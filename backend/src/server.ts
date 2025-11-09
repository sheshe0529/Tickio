
import express from "express";
import cors from "cors";
// Importa tus routers (controllers)
import usuarioRouter from './modules/usuario/usuario.router';
import compraRouter from './modules/compra/compra.router';

import { obtenerTiposDeEvento } from "./modules/tipoevento/tipoevento.controller";
import { obtenerDistrito } from "./modules/distrito/distrito.controller";

import eventoBuscarRouter from './modules/evento_tipo/evento.router'; 
import distritoRouter from './modules/distrito/distrito.router'; 


const app = express();
// Middleware para interpretar JSON
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
// Rutas base
app.use('/usuarios', usuarioRouter); // Todas las rutas de usuario empiezan con /usuarios
app.use('/compras', compraRouter);   // Todas las rutas de compra empiezan con /compras

app.use('/tipo-eventos', obtenerTiposDeEvento);
app.use('/distritos',obtenerDistrito);

app.use('/eventosBuscar', eventoBuscarRouter); 
app.use('/distritos', distritoRouter)

// Ruta de prueba
app.get("/", (_req, res) => {
    res.json({ message: "Servidor corriendo correctamente" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))



