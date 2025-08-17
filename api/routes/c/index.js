import CommonController from "./controller.js";
const crtl = new CommonController();

export default function applyCommonRoute(app) {
    app.post('/api/review', crtl.postReview);
}