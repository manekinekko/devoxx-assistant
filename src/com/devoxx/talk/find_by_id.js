const schedule = require("src/services/schedule");
const Predicates = require("src/services/predicates");
const { take } = require("src/services/utils/array");

module.exports = app => {
  let selectedTalkId = app.getSelectedOption();

  schedule
    .getSchedule()
    .then(slots =>
      Predicates.filter(slots, Predicates.byTalkId, selectedTalkId)
    )
    .then(slots => {
      if (slots.length === 1) {
        const slot = slots.pop();
        let tags = slot.talk.tags.map(tag => tag.value);
        let speakers = slot.talk.speakers.map(speaker => speaker.name).join(', ');

        if (app.hasScreen()) {

          
          app.setContext('find-by-tag', 1);
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
                    `https://cfp.devoxx.be/2017/talk/${slot.talk.id}/${slot.talk.title.replace(/\s/g, "_")}`
                  )
              )
              .addSuggestions(take(tags, 8))
          );
        } else {
          app.ask(
            `Here is the summary of "${slot.talk.title}": ${slot.talk
              .summary}. Do you want to know more?`
          );
        }
      } else {
        app.ask(
          `I'm sorry, the talk ID ${selectedTalkId} is not valid. Could you try again?`
        );
      }
    })
    .catch(e => app.ask(e));
};
