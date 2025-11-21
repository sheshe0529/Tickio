
import express from "express";
import cors from "cors";
// Importa tus routers (controllers)
import eventoRouter from "./modules/evento/evento.router";
// Nuevo: router de búsqueda
import searchRouter from "./routes/search";
import usuarioRouter from './modules/usuario/usuario.router';
import compraRouter from './modules/compra/compra.router';

import { obtenerTiposDeEvento } from "./modules/tipoevento/tipoevento.controller";
import { obtenerDistrito } from "./modules/distrito/distrito.controller";

import eventoBuscarRouter from './modules/evento_tipo/evento.router'; 
import distritoRouter from './modules/distrito/distrito.router'; 

import eventoFavRouter from "./modules/evento_carrusel/evento_carrusel.router";


const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
// Rutas base
 app.use('/usuarios', usuarioRouter); // Todas las rutas de usuario empiezan con /usuarios
app.use('/compras', compraRouter);   // Todas las rutas de compra empiezan con /compras
app.use("/eventos", eventoRouter); //CRUD EVENTOS
app.use("/buscarEventos", searchRouter); //busqueda compleja de eventos

app.get("/", (_req, res) => res.json({ message: "Servidor corriendo correctamente" }));
app.use('/tipo-eventos', obtenerTiposDeEvento);//tipos de eventos
app.use('/buscarEventos', eventoBuscarRouter); //FILTROS TIPO EVENTOS Y SUBTIPO //
app.use('/buscarEventosFav', eventoFavRouter); 
// http://localhost:3000/eventosBuscar/buscar?tipoEvento=CONCIERTO&
app.use('/distritos', distritoRouter) //distritos y buscar eventos por distrito

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
