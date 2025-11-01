import express from "express";
import usuarioRouter from "./modules/usuario/usuario.controller";
import compraRouter from "./modules/compra/compra.controller"; 

const app = express();
app.use(express.json());

app.use("/usuarios", usuarioRouter);
app.use("/compras", compraRouter);

app.get("/", (_req, res) => res.json({ message: "Servidor corriendo correctamente" }));

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
