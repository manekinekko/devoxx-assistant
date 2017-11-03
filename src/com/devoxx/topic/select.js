const Predicates = require("src/services/predicates");
const { getListOfSlots } = require("src/services/schedule");
const { take } = require("src/services/utils/array");

module.exports = app => {
  let selectedTopicId = app.getSelectedOption();

  getListOfSlots()
    .then(slots =>
      Predicates.filter(slots, Predicates.byTrackId, selectedTopicId)
    )
    .then(slots => {
      // we assume that a slot is a talk.

      if (app.hasScreen()) {
        let list = app.buildList();
        let title = `I found ${slots.length} available talks:`;
        const maxItems = Math.min(slots.length, 30);
        if (maxItems !== slots.length) {
          title = `I found ${slots.length} available talks. Here are ${maxItems} of them:`;
        }
        list.setTitle(title);

        slots = take(slots, maxItems);

        slots.forEach(slot => {
          list = list.addItems(
            app
              .buildOptionItem(slot.talk.id, [slot.talk.id])
              .setTitle(slot.talk.title)
              .setDescription(slot.talk.summary)
          );
          console.log("builing list with talk", slot);
        });

        app.setContext("find-by-id", 1);
        app.askWithList(`${title}. Which talk are you interested in?`, list);
      } else {
        const randomSlots = take(slots, 3);
        const slotsTitles = randomSlots.map(slot => slot.title).join(", ");

        app.ask(
          `I found ${slots.length} talks in ${topic.title}. Here are 3 of them: ${slotsTitles}. Which talk are you interested in?`
        );
      }
    })
    .catch(e => {
      app.error(e);
      app.ask(`${e}`);
    });
};
