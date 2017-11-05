const { getListOfSlots } = require("src/services/schedule");
const Predicates = require("src/services/predicates");
const { take } = require("src/services/utils/array");

module.exports = app => {
  let talkType = app.getArgument("talk-type");
  let topic = app.getArgument("topic");

  // really?
  if (topic.toLowerCase().includes("chatbot")) {
    topic = "chat bots";
  }
  if (talkType && /(session|presentation)/.test(talkType)) {
    talkType = null;
  }

  getListOfSlots()
    .then(Predicates.filterByTopic(topic))
    .then(slotsByTopic => {
      app.debug("topic", topic, slotsByTopic.length);

      let slotsByTopicAndTalkType = null;
      if (talkType) {
        slotsByTopicAndTalkType = Predicates.filterByTalkType(talkType)(
          slotsByTopic
        );
        app.debug("talkType", talkType, slotsByTopicAndTalkType.length);
      } else {
        // take care of this if the user didn't provide a talktype
        // ie: "anything about web?"
        talkType = "session";
      }

      const slots = slotsByTopicAndTalkType || slotsByTopic;

      if (slots.length > 0) {
        foundTalksByTopicAndTalkType(app, talkType, topic, slots);
      } else {
        // no talks matching both criterion, suggest other talk types
        suggestOtherTalkTypes(app, talkType, topic, slots);
      }
    })
    .catch(e => {
      app.error(e);
      app.ask(`${e}`);
    });
};

function foundTalksByTopicAndTalkType(app, talkType, topic, slots) {
  let msg = `I found`;
  if (slots.length === 1) {
    const slot = slots.pop();
    const speakers = slot.talk.speakers
      .map(speaker => speaker.name)
      .join(", ", " and ");
    const talkTitle = slot.talk.title;
    const day = slot.day;
    const time = slot.fromTime;
    const room = slot.roomName;
    msg = `${msg} one ${talkType} about ${topic} by ${speakers}. The title is "${talkTitle}" and it's scheduled on ${day} at ${time} in ${room}.`;

    app.data.talkId = slot.talk.id;

    if (app.hasScreen()) {
      buildCard(app, talkType, topic, slot);
    } else {
      app.ask(msg);
    }
  } else {
    msg = `${msg} ${slots.length} ${talkType}s about ${topic}.`;
    if (slots.length > 3) {
      slots = take(slots, 3);
      msg = `${msg} Here are 3 of them.`;
    }

    app.data.talkIds = slots.map(slot => slot.talk.id);

    const titles = slots.map((slot, index) => {
      let speakers = slot.talk.speakers
        .map(speaker => speaker.name)
        .join(", ", " and ");
      return `The ${ordinal(index)} one is: "${slot.talk
        .title}" by ${speakers}; on ${slot.day} at ${slot.fromTime} in ${slot.roomName}.`;
    });

    const ordinals = titles
      .map((talk, index) => ordinal(index))
      .join(", ", " or ");

    msg = `${msg} ${titles.join(
      " ",
      " and "
    )} Which talk are you interested in: The ${ordinals} one?`;
    if (app.hasScreen()) {
      buildList(app, msg, slots);
    } else {
      app.ask(msg);
    }
  }
}

function suggestOtherTalkTypes(app, talkType, topic, slots) {
  if (slots.length === 0) {
    app.ask(
      `Sorry, I found no ${talkType} about ${topic}. You might wanna try another topic.`
    );
  } else {
    const map = new Map();
    slots.reduce(
      (acc, slot) =>
        acc.set(slot.talk.talkType, (acc.get(slot.talk.talkType) || 0) + 1),
      map
    );

    const talks = Array.from(map.entries())
      .map(talk => `${talk[1]} ${talk[2]}`)
      .join(", ", " and ");

    let msg = `Sorry, I found no ${talkType} about ${topic}. `;
    if (topic.toLowerCase().includes("session")) {
      msg = "";
    }

    app.ask(`${msg}But I found ${talks}.`);
  }
}

function buildList(app, msg, slots) {
  let list = app.buildList(msg);

  slots.forEach(slot => {
    list = list.addItems(
      app
        .buildOptionItem(slot.talk.id, [slot.talk.id])
        .setTitle(slot.talk.title)
        .setDescription(slot.talk.summary)
    );
    app.debug("builing list with talk ID", slot.talk.id);
  });

  app.setContext("find-by-id", 1);
  app.askWithList(`${msg}. Which talk are you interested in?`, list);
}

function buildCard(app, talkType, topic, slot) {
  const speakers = slot.talk.speakers
    .map(speaker => speaker.name)
    .join(", ", " and ");
  const talkTitle = slot.talk.title;
  const day = slot.day;
  const time = slot.fromTime;
  const room = slot.roomName;
  const id = slot.talk.id;
  const msg = `I found this ${talkType} about ${topic} by ${speakers}. The title is "${talkTitle}" and it's scheduled on ${day} at ${time} in ${room}.`;

  app.setContext("speaker-bio", 1);

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
            `https://cfp.devoxx.be/2017/talk/${id}/${talkTitle.replace(
              /\s/g,
              "_"
            )}`
          )
      )
      .addSuggestions(speakers.split(","))
  );
}

function ordinal(index) {
  switch (index) {
    case 0:
      return "1st";
    case 1:
      return "2nd";
    case 2:
      return "3rd";
    default:
      return `${index + 1}th`;
  }
}

module.exports.ordinal = ordinal;
