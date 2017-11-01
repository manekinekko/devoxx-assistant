const { devoxxApiMock } = require("./utils/http");
const { getListOfSlots } = require("./schedule");
const Predicates = require("./predicates");

function getSpeakersAsObjet() {
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
  return getSpeakersAsObjet().then(speakers => Array.from(speakers.values()));
}

function getSpeakersBy(predicate, comparator) {
  // @fixme: getListOfSlots is not a function
  return require("./schedule")
    .getListOfSlots()
    .then(slots => Predicates.filter(slots, predicate, comparator))
    .then(slots => {
      const speakers = slots
        .map(slots => slots.talk.speakers)
        .reduce((acc, sp) => acc.concat(sp), [])
        .reduce((acc, sp) => acc.set(sp.name, sp), new Map());
      return Array.from(speakers.values());
    })
    .then(speakers => Promise.all([speakers, getSpeakersAsObjet()]))
    .then(([speakers, speakersWithDetails]) => {
      return speakers.map(speaker => {
        const uuid = speaker.link.href.split("/").pop();
        console.log("found uuid", uuid);
        return speakersWithDetails.get(uuid);
      });
    });
}

function getSpeakersByRoomName(roomName) {
  return getSpeakersBy(Predicates.byRoomName, roomName);
}

function getSpeakersByTag(tag) {
  return getSpeakersBy(Predicates.byTag, tag);
}

module.exports = {
  getSpeakersAsObjet,
  getSpeakersAsArray,
  getSpeakersByTag,
  getSpeakersByRoomName
};
