const ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
const fetch = require('node-fetch');

const intents = [
    'find_by_topic',
    // 'find_by_topic_more',
    // 'find_by_topic_next',
    'list_topics'
];

exports.agent = function(request, response) {
    console.log("start");
    let assistant = new ApiAiAssistant({ request, response });
    let actionMap = new Map();
    intents.forEach(intent => actionMap.set(intent, require(`./src/intents/${intent}`)(app)));
    assistant.handleRequest(actionMap);
};