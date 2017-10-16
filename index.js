const DialogflowApp = require('actions-on-google').DialogflowApp;
const fetch = require('node-fetch');

const intents = [
    'find_by_topic',
    // 'find_by_topic_more',
    // 'find_by_topic_next',
    'list_topics',
    'actions.intent.OPTION'
];

exports.agent = function(request, response) {
    console.log("start");
    let assistant = new DialogflowApp({ request, response });
    let actionMap = new Map();
    intents.forEach(intent => actionMap.set(intent, require(`./src/intents/${intent}`)));
    assistant.handleRequest(actionMap);
};