const Debug = require('debug');
const debug = Debug('com.devoxx:debug');
const error = Debug('com.devoxx:error');

const schedule = require("src/services/schedule");
const { take } = require("src/services/utils/array");

module.exports = app => {
  let selectedTopic = app.getSelectedOption();
  
  schedule.getSchedule()
    .then(slots => slots.filter(schedule.byTrackId(selectedTopic)))
    .then(slots => {
      // we assume that a slot is a talk.

      if (app.hasScreen()) {
        
        let list = app.buildList();

        const maxItems = Math.min(slots.length, 30);
        if (maxItems === slots.length) {
          list.setTitle(`I found ${slots.length} available talks:`);
        }
        else {
          list.setTitle(`I found ${slots.length} available talks. Here are ${maxItems} of them:`);
        }
        
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
        
        app.askWithList(`Which talk are you interested in?`, list);
        
      } else {
        const randomSlots = take(slots, 3);
        const slotsTitles = randomSlots.map(slot => slot.title).join(", ");

        app.ask(
          `I found ${slots.length} talks in ${topic.title}. Here are 3 of them: ${slotsTitles}. Which talk are you interested in?`
        );
      }
    })
    .catch(e => app.tell(`${e}`));
};
