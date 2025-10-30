"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app = (0, express_1.default)();
app.get("/", function (req, res) {
    res.json({ message: "Hellos World" });
});
var PORT = 3000;
app.listen(PORT, function () { return console.log("Servidor corriendo en puerto ".concat(PORT)); });
