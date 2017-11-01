const { devoxxApi } = require("./utils/http");
const Predicates = require("./predicates");
const { getSpeakersAsObjet } = require("./speaker");

function getSchedule() {
  return devoxxApi(/* root api */).then(data => {
    // SchduleObject = {
    //   proposalTypesId: [''],
    //   label: '',
    //   localisation: '',
    //   days: [''],
    //   locale: ['']
    // }

    // get the schedule of each day
    const conferenceDyas = data.days.map(day =>
      devoxxApi(`/schedules/${day.toLowerCase()}`)
    );

    return Promise.all(conferenceDyas)
      .then(data => data.map(d => d.slots))
      .then(slots => [].concat(...slots));
  });
}

function getSpeakersByRoomName(roomName) {
  return getSchedule()
    .then(slots => Predicates.filter(slots, Predicates.byRoomName, roomName))
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
        const uuid = speaker.link.href.split('/').pop();
        return speakersWithDetails.get(uuid);
      });
    });
}

function listAllTags() {
  return getSchedule()
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
  return getSchedule().then(slots =>
    Predicates.filter(slots, Predicates.byTrackId, trackId)
  );
}

function listAllRooms() {
  return getSchedule()
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
  listAllTags,
  listAllRooms,
  getSchedule,
  getTopicsByTrackId,
  getSpeakersByRoomName
};
