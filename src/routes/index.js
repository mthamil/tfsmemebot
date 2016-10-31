import Router from "koa-better-router";
import { MemeGenerator } from "../services/meme-generator";

const router = new Router().loadMethods();

router.get("/", async (ctx, next) => {
    const memeGen = new MemeGenerator();
    try {
        const url = await memeGen.create(ctx.request.query.displayName,
                                         ctx.request.query.topText,
                                         ctx.request.query.bottomText);
        ctx.response.redirect(url);
    } finally {
        await next();
    }
});

export { router };