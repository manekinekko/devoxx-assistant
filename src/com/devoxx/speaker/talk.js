const { getSpeakersAsArray } = require("src/services/speaker");
const Predicates = require("src/services/predicates");
const { ordinal } = require("../talk/find_by_topic");

module.exports = app => {
  const speakerName = app.getArgument("speaker-name");
  const uuid = app.data.selectedSpeakerUuid;

  getSpeakersAsArray()
    .then(speakers => {
      let speaker = null;
      if (speakerName) {
        speakers = Predicates.filterBySpeakerName(speakerName)(speakers);
      } else if (uuid) {
        speakers = Predicates.filterBySpeakerUUID(uuid)(speakers);
      }

      if (speakers) {
        const speaker = speakers;
        const talks = speaker.acceptedTalks;

        if (talks.length === 0) {
          app.ask(
            `Humm! That's weird, ${speaker.firstName} doesn't seem to have any talk. Is that a bug? Should I ping the Devoxx crew?`
          );
        } else if (talks.length === 1) {
          const talk = talks.pop();
          app.data.talkId = talk.id;

          app.askForConfirmation(
            `${speaker.firstName} has a ${talk.talkType} in ${talk.track} called: ${talk.title}. Would you like to know more about this ${talk.talkType}?`
          );
        } else {
          app.data.talkIds = talks.map(talk => talk.id);

          if (app.hasScreen()) {
            let list = app.buildList(`Here are ${speaker.firstName}'s talks:`);

            talks.forEach(talk => {
              list = list.addItems(
                app
                  .buildOptionItem(talk.id, [talk.id])
                  .setTitle(talk.title)
                  .setDescription(
                    `Track: ${talk.track.replace(/\&amp\;/g, "&")}`
                  )
              );
              console.log("builing list with talk", talk);
            });

            app.setContext("find-by-id", 1);
            app.askWithList(
              `Here are ${speaker.firstName}'s talks. Which talk are you interested in?`,
              list
            );
          } else {
            let msg = `Here are ${speaker.firstName}'s talks:`;
            const titles = talks.map((talk, index) => {
              return `The ${ordinal(
                index
              )} one is a ${talk.talkType} called "${talk.title}".`;
            });
            const ordinals = talks
              .map((talk, index) => ordinal(index))
              .join(", ", " or ");

            msg = `${msg} ${titles.join(
              " ",
              " and "
            )} Which talk are you interested in: The ${ordinals} one?`;
            app.ask(msg);
          }
        }
      } else {
        app.ask(
          `I didn't get which speaker are you looking for. Can you say that again?`
        );
      }
    })
    .catch(e => {
      app.error(e);
      app.ask(`${e}`);
    });
};
