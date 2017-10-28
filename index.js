const Actionary = require('./src/services/actionary');

const ACTIONS = [
  'com.devoxx.easter',
  'com.devoxx.topic.list',
  'com.devoxx.topic.select',
  'com.devoxx.talk.current',
  'com.devoxx.talk.find_by_topic',
  'com.devoxx.talk.find_by_topic.next',
  'com.devoxx.talk.find_by_topic.more'
];

exports.agent = function(request, response) {
    console.log("starting the agent...");

    new Actionary({request, response})
      .setActions(ACTIONS)
      .start();
};
