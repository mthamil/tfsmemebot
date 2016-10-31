import Router from "koa-better-router";
import { MemeGenerator } from "../services/meme-generator";
import { parser } from "../services/command-parser";
import { ChatService } from "../services/chat";

const router = new Router().loadMethods();

router.post("/retrieve", async (ctx, next) => {
    const memeGen = new MemeGenerator();
    const chat = new ChatService();
    const message = ctx.request.fields;

    try {
        if (message.eventType && message.eventType === "message.posted" &&
            message.publisherId && message.publisherId === "tfs" &&
            message.resource && message.resource.content) {

                const command = message.resource.content;
                const result = parser.parse(command);
                let chatMessage = null;
                if (result) {
                    try {
                        const imageUrl = await memeGen.create(result.name, 
                                                              result.topText, 
                                                              result.bottomText);
                        chatMessage = imageUrl;
                    } catch (error) {
                        console.log(error);
                        chatMessage = `Sorry ${message.resource.postedBy.displayName}, MemeBot couldn't find a meme called '${result.name}'.`;
                    }
                } else {
                    chatMessage = `Sorry ${message.resource.postedBy.displayName}, MemeBot didn't understand you.`;
                }
                
                chat.send(message.resource.postedRoomId, chatMessage);
        }
    } finally {
        ctx.response.status = 200;
        await next();
    }
});

export { router };