// import express from "express"
// const router = express.Router();

import PMAPController from "./controller.js";
let ctrl = new PMAPController()

export default function applyPaintMeAPictureRoute(app) {
    app.get('/picture', (req,res)=>ctrl.getPicture(req, res));
}