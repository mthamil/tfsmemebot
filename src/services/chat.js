import request from "request-ntlm-continued";
import { Promise } from "bluebird";
import URITemplate from "urijs/src/URITemplate";
import config from "config";

const post = Promise.promisify(request.post, { context: request });

class ChatService {
    constructor() {
        const tfsConfig = config.get("TFS");
        this.apiRoot = tfsConfig.apiRoot;
        this.username = tfsConfig.username;
        this.password = tfsConfig.password;
        this.domain = tfsConfig.domain;
        this.workstation = tfsConfig.workstation;
    }

    send(roomId, message) {
        console.log("Outgoing chat message: %s", message);
        return post({
                  url: URITemplate(this.apiRoot).expand({ roomId }).toString(),
                  username: this.username,
                  password: this.password,
                  ntlm_domain: this.domain,
                  workstation: this.workstation
               }, { 
                   content: message 
               });
    }
}

export { ChatService };