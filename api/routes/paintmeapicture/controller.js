import { getPixels, updatePixels, savePixels } from "../../state.js"

class PMAPController{

    constructor(){

    }

    getPicture(req, res){
        let pixels = getPixels();
        res.json(pixels);
    }
}

export default PMAPController;