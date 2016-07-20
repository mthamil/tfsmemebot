import { Router }        from "express";
import { MemeGenerator } from "../services/meme-generator";
import { parser }        from "../services/command-parser";
import { ChatService }   from "../services/chat";

const router = Router();
const chat = new ChatService();

router.post("/retrieve", (req, res) => {

  const message = req.body;
  if (message.eventType && message.eventType === "message.posted" &&
      message.publisherId && message.publisherId === "tfs" &&
      message.resource && message.resource.content) {

        const command = message.resource.content;
        const result = parser.parse(command);
        if (result) {
          new MemeGenerator()
            .create(result.name, result.topText, result.bottomText)
            .then(imageUrl => {
                  return chat.send(message.resource.postedRoomId, imageUrl)
            })
            .catch(error => res.send(error));
          return;
        }
  }

  res.sendStatus(200);
});

export { router };