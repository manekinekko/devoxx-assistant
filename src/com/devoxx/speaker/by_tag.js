const { getSpeakersByTag } = require("src/services/speaker");

module.exports = app => {
  const tag = app.getArgument("tag");
  getSpeakersByTag(tag).then(speakers => {
    if (speakers.length === 0) {
      app.tell(
        `It seems there is no person speaking about ${tag}. You might want to try with a different topic.`
      );
    } else {
      if (app.hasScreen()) {
        // show a carousel with the tracks icons

        let list = app.buildList(`Here are the people speaking about ${tag}:`);

        speakers.forEach(speaker => {
          const name = `${speaker.firstName} ${speaker.lastName}`;
          list = list.addItems(
            app
              .buildOptionItem(name, [name])
              .setTitle(name)
              .setDescription(speaker.bio)
              .setImage(speaker.avatarURL, name)
          );
          console.log("builing list with speaker", speaker);
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

        app.setContext("speakers", 2, randomSpeakers);

        app.ask(
          `I found ${speakers.length} speakers presenting about ${tag}. Here are 3 of them: ${speakersNames}. Which speaker are you interested in?`
        );
      }
    }
  });
};
