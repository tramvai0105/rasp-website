// import express from "express"
// const router = express.Router();

import PMAPController from "./controller.js";
let ctrl = new PMAPController()

export default function applyPaintMeAPictureRoute(app) {
    app.get('/api/picture', (req,res)=>ctrl.getPicture(req, res));
    app.get('/api/history', (req, res)=>ctrl.getHistory(req, res));
}