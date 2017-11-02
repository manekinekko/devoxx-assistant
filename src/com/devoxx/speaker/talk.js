const { getSpeakersAsObject } = require("src/services/speaker");

module.exports = app => {
  const uuid = app.data.selectedSpeakerUuid;

  getSpeakersAsObject()
    .then(speakers => {
      const speaker = speakers.get(uuid);

      if (speaker) {
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
          let list = app.buildList(`Here are ${speaker.firstName}'s talks:`);

          talks.forEach(talk => {
            list = list.addItems(
              app
                .buildOptionItem(talk.id, [talk.id])
                .setTitle(talk.title)
                .setDescription(`Track: ${talk.track.replace(/\&amp\;/g, '&')}`)
            );
            console.log("builing list with talk", talk);
          });

          app.setContext("find-by-id", 1);
          app.askWithList(
            `Here are ${speaker.firstName}'s talks. Which talk are you interested in?`,
            list
          );
        }
      } else {
        app.ask(
          `I didn't get which speaker are you looking for. Can you say that again?`
        );
      }
    })
    .catch(e => app.ask(`${e}`));
};
