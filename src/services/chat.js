import request from "request-ntlm-continued";
import { Promise } from "bluebird";
import URITemplate       from "urijs/src/URITemplate";
import config            from "config";

const tfsConfig = config.get("TFS");
const post = Promise.promisify(request.post, { context: request });

class ChatService {
    send(roomId, message) {
          return post({
                    url: URITemplate(tfsConfig.apiRoot).expand({ roomId: roomId }).toString(),
                    username: tfsConfig.username,
                    password: tfsConfig.password,
                    ntlm_domain: tfsConfig.domain,
                    workstation: tfsConfig.workstation
                }, { 
                    content: message 
                });
    }
}

export { ChatService };