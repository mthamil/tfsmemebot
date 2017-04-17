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
                            .directory("Generators_Search")
                            .query({ q: name, pageIndex: 0, pageSize: 1 })
                            .toString();

        const searchBody = await request.get(searchUrl);
        const searchResponse = JSON.parse(searchBody);
        if (!searchResponse.success) {
            throw searchResponse;
        }

        let searchResult = null;
        if (searchResponse.result.length === 0) {
            const lookupUrl = URI(this.apiRoot)
                                .directory("Generator_Select_ByUrlNameOrGeneratorID")
                                .query({ urlName: name.replace(/ /g, "-") })
                                .toString();

            const lookupBody = await request.get(lookupUrl);
            const lookupResponse = JSON.parse(lookupBody);
            if (!lookupResponse.success) {
                throw lookupResponse;
            }
            searchResult = lookupResponse.result;
        } else {
            searchResult = searchResponse.result[0];
        }

        const createUrl = URI(this.apiRoot)
                            .directory("Instance_Create")
                            .query({
                                username: this.username,
                                password: this.password,
                                languageCode: "en",
                                generatorID: searchResult.generatorID,
                                imageID: new URI(searchResult.imageUrl).suffix("").filename().toString(),
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