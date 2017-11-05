const { getListOfSlots } = require("src/services/schedule");
const Predicates = require("src/services/predicates");

module.exports = app => {
  let selectedTalkId = app.getSelectedOption();

  getListOfSlots()
    .then(slots =>
      Predicates.filter(slots, Predicates.byTalkId, selectedTalkId)
    )
    .then(slots => {
      if (slots.length === 1) {
        const slot = slots.pop();
        let tags = slot.talk.tags.map(tag => tag.value);
        let speakers = slot.talk.speakers
          .map(speaker => speaker.name)
          .join(", ", " and ");

        app.setContext("speaker-talks", 1);

        if (app.hasScreen()) {
          app.ask(
            app
              .buildRichResponse()
              .addSimpleResponse(`${slot.talk.title} by ${speakers}`)
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
              .addSuggestions(speakers.split(","))
          );
        } else {
          app.ask(
            `Here is the summary of "${slot.talk.title}" by ${speakers}: ${slot
              .talk.summary}. Do you want to know more?`
          );
        }
      } else {
        app.ask(
          `I'm sorry, the talk ID ${selectedTalkId} is not valid. Could you try again?`
        );
      }
    })
    .catch(e => {
      app.error(e);
      app.ask(`${e}`);
    });
};
