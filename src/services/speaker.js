const { devoxxApiMock } = require("./utils/http");
const { getListOfSlots } = require("./schedule");
const Predicates = require("./predicates");

function getSpeakersAsObject() {
  return devoxxApiMock("speakers").then(speakers =>
    Promise.resolve(
      speakers.reduce(
        (map, speaker) => map.set(speaker.uuid, speaker),
        new Map()
      )
    )
  );
}

function getSpeakersAsArray() {
  return getSpeakersAsObject().then(speakers => Array.from(speakers.values()));
}

function getSpeakersBy(predicates) {
  // FIXME: getListOfSlots is not a function
  return require("./schedule")
    .getListOfSlots()
    .then(slots => {
      predicates.forEach(prediate => {
        slots = prediate(slots);
      });
      return slots;
    })
    .then(getSpeakersFromSlots);
}

function getSpeakersFromSlots(slots) {
  const speakers = slots
    .map(slots => slots.talk.speakers)
    .reduce((acc, sp) => acc.concat(sp), [])
    .reduce((acc, sp) => acc.set(sp.name, sp), new Map());

  return Promise.resolve(Array.from(speakers.values()))
    .then(speakers => Promise.all([speakers, getSpeakersAsObject()]))
    .then(([speakers, speakersWithDetails]) => {
      return speakers.map(speaker => {
        const uuid = speaker.link.href.split("/").pop();
        const s = speakersWithDetails.get(uuid);
        if (!s) {
          console.error("************************************");
          console.error(uuid, "NOT_FOUND in local speakers DB");
          console.error("************************************");
        }
        return s
      });
    })
    .then(speakers => speakers.filter(speaker => !!speaker));
}

function getSpeakersByRoomName(roomName = "") {
  return getSpeakersBy([
    slots =>
      Predicates.filter(
        slots,
        Predicates.byRoomName,
        roomName.toLocaleLowerCase()
      )
  ]);
}

function getSpeakersByTag(tag = "") {
  return getSpeakersBy([Predicates.filterByTag(tag)]);
}

function getSpeakersByDay(day = "") {
  return getSpeakersBy([Predicates.filterByDay(day)]);
}

module.exports = {
  getSpeakersAsObject,
  getSpeakersAsArray,
  getSpeakersByTag,
  getSpeakersByRoomName,
  getSpeakersByDay,
  getSpeakersBy,
  getSpeakersFromSlots
};
