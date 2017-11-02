const { getSpeakersAsArray } = require("src/services/speaker");

module.exports = app => {
  let speakerName = app.getSelectedOption();
  if (!speakerName) {
    speakerName = app.data.speakerName;
  }

  getSpeakersAsArray().then(speakers => {
    const speaker = speakers
      .filter(speaker => {
        const name = `${speaker.firstName} ${speaker.lastName}`;
        return name
          .toLocaleLowerCase()
          .includes(speakerName.toLocaleLowerCase());
      })
      .pop();

    if (speaker) {
      
      app.data.selectedSpeakerUuid = speaker.uuid;

      if (app.hasScreen()) {
        app.ask(
          app
            .buildRichResponse()
            .addSimpleResponse(
              `Here is the bio of ${speaker.firstName} ${speaker.lastName}`
            )
            .addBasicCard(
              app
                .buildBasicCard(speaker.bio)
                .setImage(
                  speaker.avatarURL,
                  `${speaker.firstName} ${speaker.lastName}`
                )
                .setTitle(`${speaker.firstName} ${speaker.lastName}`)
                .addButton(
                  "Visit blog",
                  speaker.blog
                    ? speaker.blog
                    : `https://twitter.com/${speaker.twitter}`
                )
            )
            .addSuggestions(["talks"])
        );
      } else {
        app.ask(`${speaker.bio}. Anything you wanna know about this speaker?`);
      }
    } else {
      app.ask(`Sorry, I could not find any information about ${speakerName}.`);
    }
  });
};
