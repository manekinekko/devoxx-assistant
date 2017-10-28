const schedule = require("src/services/schedule");
const { take } = require("src/services/utils/array");

module.exports = app => {
  let selectedTopic = app.getContextArgument("actions_intent_option", "OPTION")
    .value;
  console.log("selectedTopic", selectedTopic);

  schedule()
    // .then(slots => slots.filter(slot => slot.talk))
    // .then(slots => slots.filter(slot => slot.talk.trackId === selectedTopic))
    .then(slots => {

      app.ask(`Found ${data.length} slots in ${selectedTopic}`);

      if (app.hasScreen()) {
        
        let list = app.buildList(`I found ${slots.length} available slots. Here are 10 of them:`);

        take(slots, 10).map(slot => {
          list = list.addItems(
            app
              .buildOptionItem(slot.id, [slot.id])
              .setTitle(slot.title)
              .setDescription(topic.summary)
          );
          console.log("builing list with slot", slot);
        });

        app.askWithList(`Which slot are you interested in?`, list);
      } else {
        const randomSlots = take(slotsTitles, 3)
        const slotsTitles = randomSlots.map(slot => slot.title).join(", ");
        const topicsInContext = app.getContext("topics");
        let topic = {};
        if (topicsInContext) {
          topic = topicsInContext.filter(topic => topic.id === selectedTopic).pop();
        }

        app.ask(
          `I found ${slots.length} slots in ${topic.title}. Here are 3 of them: ${slotsTitles}. Which slot are you interested in?`
        );
      }
    });
};
