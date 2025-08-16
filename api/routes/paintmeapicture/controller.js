import { getPixels, getHistory } from "../../state.js"

class PMAPController{

    constructor(){

    }

    getPicture(req, res){
        let pixels = getPixels();
        res.json(pixels);
    }

    getHistory(req, res){
        let history = getHistory();
        res.json(history);
    }
}

export default PMAPController;