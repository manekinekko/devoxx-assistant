const { getListOfSlots } = require("src/services/schedule");
const { getSpeakersBy, getSpeakersFromSlots } = require("src/services/speaker");
const Predicates = require("src/services/predicates");
const { take } = require("src/services/utils/array");
const moment = require("moment");

module.exports = app => {
  const roomName = app.getArgument("room");
  let date = app.getArgument("date");
  let time = app.getArgument("time");
  let when = app.getArgument("when");
  let currentTime = "";
  let day = "";
  if (date) {
    // fix DialogFlow timezone, otherwise moment() will add +1 hour
    date = date.replace(/Z$/, "");
    day = moment(date)
      .format("dddd")
      .toLocaleLowerCase();
  }

  if (time) {
    const t = time.split(":");
    if (date) {
      const date_ = moment(date);
      currentTime = moment({
        day: date_.day(),
        month: date_.month(),
        year: date_.year(),
        hour: t[0],
        minute: t[1],
        second: t[2]
      });
    } else {
      // warning: moment will set the day to "today"
      currentTime = moment({
        hour: t[0],
        minute: t[1],
        second: t[2]
      });
    }
  }

  if (when) {
    currentTime = moment(app.getDateTimeFromRequest());
    day = currentTime.format("dddd").toLowerCase();
  }

  app.debug(`date=${date} time=${time} roomName=${roomName} currentTime=${currentTime} day=${day}`);

  getListOfSlots()
    .then(Predicates.filterByRoom(roomName))
    .then(Predicates.filterByDay(day))
    .then(Predicates.filterByTime([currentTime, date]))
    .then(slots => {
      app.debug(`found ${slots.length} slot`);

      if (slots.length === 0) {
        // no current talk
        foundNoSpeaker(app, roomName, currentTime);
      } else if (slots.length === 1) {
        // one talk (in room X)
        foundOneSpeaker(app, slots.pop(), day, currentTime);
      } else {
        // X talks
        foundManySpeakers(app, slots, roomName, day, currentTime);
      }
    })
    .catch(e => {
      app.error(e);
      app.ask(`${e}`);
    });
};

function foundNoSpeaker(app, roomName, currentTime) {

  roomName = roomName ? ` in ${roomName}` : "";

  if (currentTime) {
    const isNoTimeGiven = currentTime.hours() === 0;

    if (isNoTimeGiven) {
      app.ask(
        `Humm! There is no talk${roomName} on ${currentTime.format(
          "dddd"
        )}. You might wanna try with different days and room names.`
      );
    } else {
      app.ask(
        `It seems there is no person speaking${roomName} on ${currentTime.format(
          "dddd"
        )} at ${currentTime.format(
          "LT"
        )}. You might wanna try with different time and room names.`
      );
    }
  } else {
    app.ask(
      `There is no talk${roomName}. You might wanna try with different room names.`
    );
  }
}
function foundOneSpeaker(app, slot, day, time) {
  const speakers = slot.talk.speakers
    .map(speaker => speaker.name)
    .join(", ", " and ");
  app.data.slotId = slot.id;
  const msg = `I found this ${slot.talk.talkType}: "${slot.talk
    .title}" by ${speakers}. It is scheduled from ${slot.fromTime} to ${slot.toTime} in ${slot.roomName}.`;
  // const msg = `I found this talk by ${speakers}, it's called: "${slot.talk.title}. The talk starts at ${slot.fromTime} in ${slot.roomName}. It will end at ${slot.toTime}`;

  app.data.talkId = slot.talk.id;
  app.setContext("find-by-id", 1);

  if (app.hasScreen()) {
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
        .addSuggestions(speakers.split(","))
    );
  } else {
    app.ask(msg);
  }
}
function foundManySpeakers(app, slots, roomName, day, currentTime) {
  getSpeakersFromSlots(slots).then(speakers => {
    if (app.hasScreen()) {
      let title = `I found ${speakers.length} speakers and ${slots.length} talks`;
      if (roomName) {
        title = `${title} in ${roomName}`;
      }
      title = day ? `${title} on ${day}` : `${title}`;
      title = currentTime ? `${title} at ${currentTime}.` : `${title}.`;
      let list = app.buildList(title);

      speakers.forEach(speaker => {
        if (speaker) {
          const name = `${speaker.firstName} ${speaker.lastName}`;
          list = list.addItems(
            app
              .buildOptionItem(name, [`Tell me more about ${name}`])
              .setTitle(name)
              .setDescription(speaker.bio)
              .setImage(speaker.avatarURL, name)
          );
          console.log("builing list with speaker UUID", speaker.uuid);
        }
      });

      app.setContext("speaker-bio", 1);

      app.askWithList(`${title} Which speaker are you interested in?`, list);
    } else {
      const randomSpeakers = take(speakers, 3);
      const speakersNames = randomSpeakers
        .map(speaker => `${speaker.firstName} ${speaker.lastName}`)
        .join(", ");

      app.ask(
        `I found ${speakers.length} speakers presenting in ${roomName}. Here are 3 of them: ${speakersNames}. Which speaker are you interested in?`
      );
    }
  });
}
