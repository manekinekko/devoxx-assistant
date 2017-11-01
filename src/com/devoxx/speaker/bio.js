const { getSpeakersAsArray } = require("src/services/speaker");

module.exports = app => {
  const speakerName = app.getSelectedOption();

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
      if (app.hasScreen()) {
        app.ask(
          app
            .buildRichResponse()
            .addSimpleResponse(speaker.bio)
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
        app.ask(`${speaker.bio}. Anything else you wanna know?`);
      }
    } else {
      app.ask(`Sorry, I could not find any information about ${speakerName}.`);
    }
  });
};
