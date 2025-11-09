import express from "express";
import { obtenerDistrito } from "./distrito.controller";

const router = express.Router();

//get
router.get('/distritos',obtenerDistrito);

export default router;