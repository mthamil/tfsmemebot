import { Router }  from "express";
import request     from "request-promise";
import { Promise } from "bluebird";
import URI         from "urijs";
import config      from "config";

const memeConfig = config.get("MemeGenerator");
const router = Router();

router.get("/", (req, res) => {

    const searchUrl = URI(memeConfig.apiRoot)
                        .directory("Generator_Select_ByUrlNameOrGeneratorID")
                        .query({ urlName: req.query.displayName.replace(" ", "-") })
                        .toString();
    request
        .get(searchUrl)
        .then(body => {
            const searchResult = JSON.parse(body);

            if (searchResult.success) {
                const createUrl = URI(memeConfig.apiRoot)
                                    .directory("Instance_Create")
                                    .query({
                                        username: memeConfig.username,
                                        password: memeConfig.password,
                                        languageCode: "en",
                                        generatorID: searchResult.result.generatorID,
                                        imageID: new URI(searchResult.result.imageUrl).suffix("").filename().toString(),
                                        text0: req.query.topText,
                                        text1: req.query.bottomText
                                    })
                                    .toString();

                return request.get(createUrl);
            }

            return Promise.reject(searchResult);
        })
        .then(body => {
            const createResult = JSON.parse(body);
            if (createResult.success) {
                res.redirect(302, createResult.result.instanceImageUrl);
                return;
            }
            
            return Promise.reject(createResult);
        })
        .catch(error => res.send(error));
});

export { router };