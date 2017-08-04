const ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
const fetch = require('node-fetch');

const intents = [
    '_devoxxx.find_by_topic',
    '_devoxxx.find_by_topic_more',
    '_devoxxx.find_by_topic_next',
];

exports.agent = function(request, response) {
    console.log("start");
    let assistant = new ApiAiAssistant({ request, response });
    let actionMap = new Map();
    intents.forEach(intent => actionMap.set(intent, require(`./${intents}`)));
    assistant.handleRequest(actionMap);
};