import db from "../../data/db.js";

class CommonController{

    constructor(){

    }

    async postReview(req, res){
        let data = req.body;
        db.addReview(data.sender, data.text);
        return res.json({message: "Ваш отзыв сохранен."})
    }
}

export default CommonController;