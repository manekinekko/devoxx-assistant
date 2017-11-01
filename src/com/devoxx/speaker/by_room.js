const { getSpeakersByRoomName } = require("src/services/schedule");
const { take } = require("src/services/utils/array");

module.exports = app => {
  const roomName = app.getArgument("room");

  getSpeakersByRoomName(roomName)
    .then(speakers => {
      if (speakers.length === 0) {
        app.tell(
          `It seems there is no person speaking in ${roomName}. You might want to try with a different room name.`
        );
      } else {
        if (app.hasScreen()) {
          // show a carousel with the tracks icons

          let list = app.buildList(
            `Here are the people speaking in ${roomName}:`
          );

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

          app.setContext("speaker-bio");
          app.askWithList(
            `Here are the people speaking in ${roomName}. Which speaker are you interested in?`,
            list
          );
        } else {
          const randomSpeakers = take(speakers, 3);
          const speakersNames = randomSpeakers
            .map(speaker => `${speaker.firstName} ${speaker.lastName}`)
            .join(", ");

          app.setContext("speakers", 2, randomSpeakers);

          app.ask(
            `I found ${speakers.length} speakers presenting in ${roomName}. Here are 3 of them: ${speakersNames}. Which speaker are you interested in?`
          );
        }
      }
    })
    .catch(e => app.ask(`${e}`));
};
