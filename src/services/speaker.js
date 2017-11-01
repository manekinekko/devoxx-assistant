const { devoxxApiMock } = require("./utils/http");

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

module.exports = {
  getSpeakersAsObjet,
  getSpeakersAsArray
};
