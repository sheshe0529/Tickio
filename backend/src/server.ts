import express from "express"
import usuarioRouter from './modules/usuario/usuario.controller';

const app = express()

app.get("/", (req, res) => {
    res.json({ message: "Hellos World" });
});
app.use(express.json());
app.use('/usuarios', usuarioRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));



