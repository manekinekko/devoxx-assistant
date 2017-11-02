const Predicates = require("./predicates");
const { devoxxApi } = require("./utils/http");
const { getSpeakersAsObject } = require("./speaker");

function getListOfSlots() {
  return devoxxApi(/* root api */).then(data => {
    // get the schedule of each day
    const conferenceDyas = data.days.map(day =>
      devoxxApi(`/schedules/${day.toLowerCase()}`)
    );

    return Promise.all(conferenceDyas)
      .then(data => data.map(d => d.slots))
      .then(slots => [].concat(...slots));
  });
}

function listAllTags() {
  return getListOfSlots()
    .then(slots => slots.filter(slot => slot.talk))
    .then(slots => slots.map(slot => slot.talk.tags))
    .then(tags => tags.reduce((p, tag) => p.concat(tag), []))
    .then(tags => tags.map(tag => tag.value))
    .then(values => values.filter(value => value !== ""))
    .then(values => values.sort())
    .then(values => new Set(values))
    .then(values => Array.from(values));

  // format for DialogFlow entity model
  // .then(uniquetags =>
  //   uniquetags.map(tag => {
  //     return {
  //       value: tag,
  //       synonyms: [tag]
  //     };
  //   })
  // );
}

function getTopicsByTrackId(trackId) {
  return getListOfSlots().then(slots =>
    Predicates.filter(slots, Predicates.byTrackId, trackId)
  );
}

function listAllRooms() {
  return getListOfSlots()
    .then(slots => slots.map(slot => slot.roomName))
    .then(rooms => new Set(rooms))
    .then(rooms => Array.from(rooms).sort());

  // format for DialogFlow entity model
  // .then(rooms =>
  //   rooms.map(room => {
  //     return {
  //       value: room,
  //       synonyms: [room]
  //     };
  //   })
  // );
}

module.exports = {
  getListOfSlots,
  listAllTags,
  listAllRooms,
  getTopicsByTrackId
};
