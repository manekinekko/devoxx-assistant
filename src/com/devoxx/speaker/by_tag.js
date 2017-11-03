const { getSpeakersByTag } = require("src/services/speaker");
const { take } = require("src/services/utils/array");

module.exports = app => {
  const tag = app.getArgument("tag");
  getSpeakersByTag(tag)
    .then(speakers => {
      if (speakers.length === 0) {
        app.tell(
          `It seems there is no person speaking about ${tag}. You might want to try with a different topic.`
        );
      } else {
        if (app.hasScreen()) {
          // show a carousel with the tracks icons

          let list = app.buildList(
            `Here are the people speaking about ${tag}:`
          );

          speakers.forEach(speaker => {
            if (speaker) {
              const name = `${speaker.firstName} ${speaker.lastName}`;
              list = list.addItems(
                app
                  .buildOptionItem(name, [name])
                  .setTitle(name)
                  .setDescription(speaker.bio)
                  .setImage(speaker.avatarURL, name)
              );
            }
            app.debug("builing list with speaker UUID", speaker.uuid);
          });

          app.setContext("speaker-bio", 1);
          app.askWithList(
            `Here are the people speaking about ${tag}. Which speaker are you interested in?`,
            list
          );
        } else {
          const randomSpeakers = take(speakers, 3);

          const speakersNames = randomSpeakers
            .map(speaker => `${speaker.firstName} ${speaker.lastName}`)
            .join(", ");

          app.ask(
            `I found ${speakers.length} speakers presenting about ${tag}. Here are 3 of them: ${speakersNames}. Would you like to know something else?`
          );
        }
      }
    })
    .catch(e => {
      app.error(e);
      app.ask(`${e}`);
    });
};
