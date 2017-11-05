const { getListOfSlots } = require("src/services/schedule");
const Predicates = require("src/services/predicates");

module.exports = app => {
  let talkId = app.data.talkId;
  const ids = app.data.talkIds;
  const talkIndex = app.getArgument("talk-index");

  if (typeof +talkIndex === "number") {
    talkId = ids[talkIndex - 1];
    ask(app, talkId);
  } else {
    if (app.getUserConfirmation()) {
      app.debug("talkId", talkId);
      ask(app, talkId);
    } else {
      app.ask("Sure. What else can I do for you?");
    }
  }
};

function ask(app, talkId) {
  getListOfSlots()
    .then(Predicates.filterByTalkId(talkId))
    .then(slot => {
      if (!slot) {
        app.ask(
          `Sorry, I couldn't find any talk. Can you give it another try?`
        );
        return false;
      }

      const tags = slot.talk.tags.map(tag => tag.value);
      const day = slot.day;
      const time = slot.fromTime;
      const room = slot.roomName;
      let speakers = slot.talk.speakers
        .map(speaker => speaker.name)
        .join(", ", " and ");

      const msg = `"${slot.talk.title}" by ${speakers}. This ${slot.talk
        .talkType} is scheduled on ${day} at ${time} in ${room}.`;

      if (app.hasScreen()) {
        app.setContext("find-by-tag", 1);

        app.ask(
          app
            .buildRichResponse()
            .addSimpleResponse(msg)
            .addBasicCard(
              app
                .buildBasicCard(slot.talk.summary)
                .setTitle(slot.talk.title)
                .addButton(
                  "Read more",
                  `https://cfp.devoxx.be/2017/talk/${slot.talk
                    .id}/${slot.talk.title.replace(/\s/g, "_")}`
                )
            )
            .addSuggestions(tags)
        );
      } else {
        app.ask(
          `Here is the summary of "${slot.talk.title}" by ${speakers}: ${slot
            .talk.summary}. This ${slot.talk
            .talkType} is scheduled on ${day} at ${time} in ${room}.`
        );
      }
    })
    .catch(e => {
      app.error(e);
      app.ask(`${e}`);
    });
}
