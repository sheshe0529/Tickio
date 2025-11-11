// src/server.ts
import express from "express";


// Routers existentes
import usuarioRouter from "./modules/usuario/usuario.controller";
import compraRouter from "./modules/compra/compra.router";

// Nuevo: router de búsqueda
import searchRouter from "./routes/search";

const app = express();

// Middlewares

app.use(express.json());


// Rutas base existentes
app.use("/usuarios", usuarioRouter);
app.use("/compras", compraRouter);

// Nueva ruta de búsqueda (frontend hará /api/search?... )
app.use("/buscarEventos", searchRouter);

// Ping
app.get("/", (_req, res) => {
  res.json({ message: "Servidor corriendo correctamente" });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
