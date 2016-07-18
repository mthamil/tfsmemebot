import { Router } from "express";
import request from "request-promise";
import { Promise } from "bluebird";
import URI from "urijs";

const router = Router();

const memeApiRoot = "http://version1.api.memegenerator.net"; 

router.get("/", (req, res) => {

    const displayName = req.query.displayName;
    const topText = req.query.topText;
    const bottomText = req.query.bottomText;

    const searchUrl = URI(memeApiRoot)
                        .directory("Generator_Select_ByUrlNameOrGeneratorID")
                        .query({ urlName: displayName.replace(" ", "-") })
                        .toString();
    request
        .get(searchUrl)
        .then(body => {
            const searchResult = JSON.parse(body);

            if (searchResult.success) {
                const createUrl = URI(memeApiRoot)
                                    .directory("Instance_Create")
                                    .query({
                                        username: "tfsmemebot",
                                        password: "",
                                        languageCode: "en",
                                        generatorID: searchResult.result.generatorID,
                                        imageID: new URI(searchResult.result.imageUrl).suffix("").filename().toString(),
                                        text0: topText,
                                        text1: bottomText
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
            }
            
            return Promise.reject(createResult);
        })
        .catch(error => res.send(error));
});

export { router };