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
            const response = JSON.parse(body);

            if (response.success) {
                const createUrl = URI(memeConfig.apiRoot)
                                    .directory("Instance_Create")
                                    .query({
                                        username: memeConfig.username,
                                        password: memeConfig.password,
                                        languageCode: "en",
                                        generatorID: response.result.generatorID,
                                        imageID: new URI(response.result.imageUrl).suffix("").filename().toString(),
                                        text0: req.query.topText,
                                        text1: req.query.bottomText
                                    })
                                    .toString();

                return request.get(createUrl);
            }

            return Promise.reject(response);
        })
        .then(body => {
            const response = JSON.parse(body);
            if (response.success) {
                res.redirect(302, response.result.instanceImageUrl);
                return;
            }
            
            return Promise.reject(response);
        })
        .catch(error => res.send(error));
});

export { router };