import request     from "request-promise";
import { Promise } from "bluebird";
import URI         from "urijs";
import config      from "config";

class MemeGenerator {

    constructor() {
        const memeConfig = config.get("MemeGenerator");
        this.apiRoot = memeConfig.apiRoot;
        this.username = memeConfig.username;
        this.password = memeConfig.password;
    }

    create(name, topText, bottomText) {
        const searchUrl = URI(this.apiRoot)
                            .directory("Generator_Select_ByUrlNameOrGeneratorID")
                            .query({ urlName: name.replace(" ", "-") })
                            .toString();
        return request
                .get(searchUrl)
                .then(body => {
                    const response = JSON.parse(body);

                    if (response.success) {
                        const createUrl = URI(this.apiRoot)
                                            .directory("Instance_Create")
                                            .query({
                                                username: this.username,
                                                password: this.password,
                                                languageCode: "en",
                                                generatorID: response.result.generatorID,
                                                imageID: new URI(response.result.imageUrl).suffix("").filename().toString(),
                                                text0: topText,
                                                text1: bottomText
                                            })
                                            .toString();

                        return request.get(createUrl);
                    }

                    return Promise.reject(response);
                })
                .then(body => {
                    const response = JSON.parse(body);
                    if (response.success) {
                        return response.result.instanceImageUrl;
                    }
                    
                    return Promise.reject(response);
                });
    }
}

export { MemeGenerator };