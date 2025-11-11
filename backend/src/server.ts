
import express from "express";
// Importa tus routers (controllers)
// import usuarioRouter from './modules/usuario/usuario.controller';
import compraRouter from './modules/compra/compra.router';
import eventoRouter from "./modules/evento/evento.router";
// Nuevo: router de búsqueda
import searchRouter from "./routes/search";
const app = express();
app.use(express.json());

// Rutas base
// app.use('/usuarios', usuarioRouter); // Todas las rutas de usuario empiezan con /usuarios
app.use('/compras', compraRouter);   // Todas las rutas de compra empiezan con /compras
app.use("/eventos", eventoRouter); 
app.use("/buscarEventos", searchRouter);

app.get("/", (_req, res) => res.json({ message: "Servidor corriendo correctamente" }));

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
