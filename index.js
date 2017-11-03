//#region NODE_PATH
process.env["NODE_PATH"] = process.cwd();
require("module").Module._initPaths();
//#endregion

const { Actionary } = require("./src/services/actionary");

const ACTIONS = [
  "com.devoxx.easter",
  "com.devoxx.topic.list",
  "com.devoxx.topic.select",
  "com.devoxx.talk.details",
  "com.devoxx.talk.find_by_id",
  "com.devoxx.talk.find_by_tag",
  "com.devoxx.talk.find_by_topic",
  "com.devoxx.talk.find_by_topic.next",
  "com.devoxx.talk.find_by_topic.more",
  "com.devoxx.speaker.bio",
  "com.devoxx.speaker.talk",
  "com.devoxx.speaker.by_tag",
  "com.devoxx.speaker.by_room"
];

exports.agent = function(request, response) {
  console.log("starting the agent...");

  new Actionary({ request, response })
    .use(Actionary.sdk.DialogflowApp)
    .setActions(ACTIONS)
    .start();
};
