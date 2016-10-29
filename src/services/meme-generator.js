import request from "request-promise";
import URI from "urijs";
import config from "config";

class MemeGenerator {

    constructor() {
        const memeConfig = config.get("MemeGenerator");
        this.apiRoot = memeConfig.apiRoot;
        this.username = memeConfig.username;
        this.password = memeConfig.password;
    }

    async create(name, topText, bottomText) {
        const searchUrl = URI(this.apiRoot)
                            .directory("Generator_Select_ByUrlNameOrGeneratorID")
                            .query({ urlName: name.replace(/ /g, "-") })
                            .toString();

        const searchBody = await request.get(searchUrl);
        const searchResponse = JSON.parse(searchBody);
        if (!searchResponse.success) {
            throw searchResponse;
        } 
        
        const createUrl = URI(this.apiRoot)
                            .directory("Instance_Create")
                            .query({
                                username: this.username,
                                password: this.password,
                                languageCode: "en",
                                generatorID: searchResponse.result.generatorID,
                                imageID: new URI(searchResponse.result.imageUrl).suffix("").filename().toString(),
                                text0: topText,
                                text1: bottomText
                            })
                            .toString();

        const creationBody = await request.get(createUrl);
        const creationResponse = JSON.parse(creationBody);
        if (!creationResponse.success) {
            throw creationResponse;
        }

        return creationResponse.result.instanceImageUrl;
    }
}

export { MemeGenerator };