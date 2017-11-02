const { getListOfSlots } = require("src/services/schedule");
const Predicates = require("src/services/predicates");
const moment = require("moment");

module.exports = app => {
  const room = app.getArgument("room");
  let date = app.getArgument("date");
  let currentTime = moment(app.getDateTimeFromRequest());
  if (date) {
    // fix DialogFlow timezone, otherwise moment() will add +1 hour
    date = date.replace(/Z$/, "");
    currentTime = moment(date);
  } else {
    // @todo for testing purposes only.
    currentTime = moment(1510231000000);
    // currentTime = moment(app.getDateTimeFromRequest());
  }
  const day = currentTime.format("dddd").toLocaleLowerCase();

  getListOfSlots()
    .then(Predicates.filterByRoom(room))
    .then(Predicates.filterByDay(day))
    .then(Predicates.filterByTime(currentTime))
    .then(slots => {
      if (slots.length === 0) {
        // no current talk
        foundNoTalk(app, day, currentTime);
      } else if (slots.length === 1) {
        // one talk (in room X)
        foundOneTalk(app, slots.pop(), day, currentTime);
      } else {
        // X talks in Y rooms
        foundManyTalks(app, slots, day, currentTime);
      }
    })
    .catch(e => app.ask(`${e}`));
};

function foundNoTalk(app, day, time) {
  app.ask(`Found NO talk on ${day} at ${time}`);
}
function foundOneTalk(app, slot, day, time) {
  const speakers = slot.talk.speakers.map(speaker => speaker.name).join(", ");
  app.ask(`I found this talk by ${speakers}, it's called: ${slot.talk.title}.`);
}
function foundManyTalks(app, slots, day, time) {
  app.ask(`Found many talks`);
}
