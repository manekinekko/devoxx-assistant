const ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
const fetch = require('node-fetch');

exports.agent = function (request, response) {
    console.log("start");

    let assistant = new ApiAiAssistant({request, response});
    let actionMap = new Map();

    actionMap.set("card-test", assistant => {
        console.log("card-tets");

        assistant.tell("dummy");
    });

    assistant.handleRequest(actionMap);
};
