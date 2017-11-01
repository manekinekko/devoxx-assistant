const topics = require("src/services/topics");
const { take } = require("src/services/utils/array");

module.exports = app => {
  return topics()
    .then(topics => {
      if (topics.length === 0) {
        app.tell(
          `It seems there is no topic available yet. You might want to try later.`
        );
      } else {
        if (app.hasScreen()) {
          // show a carousel with the tracks icons

          let list = app.buildList(`Here are the available topics:`);

          topics.forEach(topic => {
            list = list.addItems(
              app
                .buildOptionItem(topic.id, [topic.id])
                .setTitle(topic.title)
                .setDescription(topic.description)
                .setImage(`https://cfp.devoxx.be${topic.imgsrc}`, topic.imgsrc)
            );
            console.log("builing list with track", topic);
          });

          app.askWithList(`Here are the available topics. Which track are you interested in?`, list);
        } else {
          const randomTopics = take(topics, 3);
          const topicsTitles = randomTopics
            .map(topic => topic.title)
            .join(", ");

          app.setContext("topics", 2, randomTopics);

          app.ask(
            `I found ${topics.length} topics. Here are 3 of them: ${topicsTitles}. Which track are you interested in?`
          );
        }
      }
    })
    .catch(e => {
      console.error(e);
      app.tell(
        `Oops! Something went wrong while fetching the topics list. Please try again.`
      );
    });
};
