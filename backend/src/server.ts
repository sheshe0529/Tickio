import express from "express"

const app = express()

app.get("/", (req, res) => {
    res.json({ message: "Hellos World" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

