
import express from "express";
// Importa tus routers (controllers)
import usuarioRouter from './modules/usuario/usuario.router';
import compraRouter from './modules/compra/compra.router';
import eventoBuscarRouter from './modules/evento_tipo/evento.router'; 
import distritoRouter from './modules/distrito/distrito.router'; 

const app = express();
// Middleware para interpretar JSON
app.use(express.json());

// Rutas base
app.use('/usuarios', usuarioRouter); // Todas las rutas de usuario empiezan con /usuarios
app.use('/compras', compraRouter);   // Todas las rutas de compra empiezan con /compras
app.use('/eventosBuscar', eventoBuscarRouter); 
app.use('/distritos', distritoRouter)

// Ruta de prueba
app.get("/", (_req, res) => {
    res.json({ message: "Servidor corriendo correctamente" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))



