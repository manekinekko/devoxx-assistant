const schedule = require("src/services/schedule");
const Predicates = require("src/services/predicates");
const { take } = require("src/services/utils/array");

module.exports = app => {
  const tag = app.getArgument("tag");

  schedule
    .getSchedule()
    .then(slots => Predicates.filter(slots, Predicates.byTag, tag))
    .then(slots => {
      if (app.hasScreen()) {
        if (slots.length >= 2) {
          buildList(app, slots, tag);
        } else if (slots.length === 1) {
          buildCard(app, slots, tag);
        }
        else {
          app.ask(`No talks labeled as "${tag}". Try with another tag.`);
        }
      } else {
        const randomSlots = take(slots, 3);
        const slotsTitles = randomSlots.map(slot => slot.title).join(", ");

        app.ask(
          `I found ${slots.length} talks labeled with the "${tag}" tag. Here are 3 of them: ${slotsTitles}. Which talk are you interested in?`
        );
      }
    })
    .catch(e => app.ask(`${e}`));
};

function buildList(app, slots, tag) {
  let list = app.buildList();
  let title = `I found ${slots.length} available talks labeled with the "${tag}" tag:`;
  const maxItems = Math.min(slots.length, 30);
  if (maxItems !== slots.length) {
    title = `I found ${slots.length} available talks labeled with the "${tag}" tag. Here are ${maxItems} of them:`;
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

  app.setContext("find_by_id", 1);
  app.askWithList(`${title}. Which talk are you interested in?`, list);
}

function buildCard(app, slots, tag) {
  const slot = slots.pop();
  let tags = slot.talk.tags.map(tag => tag.value);
  app.setContext("talk_details", 10, slot);
  app.ask(
    app
      .buildRichResponse()
      .addSimpleResponse(slot.talk.title)
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
      .addSuggestions(take(tags, 8))
  );
}
