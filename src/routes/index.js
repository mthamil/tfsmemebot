import { Router }        from "express";
import { MemeGenerator } from "../services/meme-generator";

const router = Router();

router.get("/", (req, res) => {
    const memeGen = new MemeGenerator();
    memeGen.create(req.query.displayName,
                   req.query.topText,
                   req.query.bottomText)
           .then(url => res.redirect(302, url))
           .catch(error => res.send(error));
});

export { router };