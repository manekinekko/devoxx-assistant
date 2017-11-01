const { getSpeakersAsArray } = require("./speaker");
const { writeJSON } = require("./utils/node");

describe.only("testing schedule", () => {
  it("should list all speakers with details", () => {
    expect.assertions(1);
    return getSpeakersAsArray().then(speakers => {
      // writeJSON("src/services/__mock__/speakers.json", speakers);
      expect(speakers).toMatchSnapshot();
    })
  });
  
  it("should list a valid speaker objet", () => {
    return getSpeakersAsArray().then(speakers => {
      const speaker = speakers.pop();
      expect(speaker.uuid).toBeTruthy();
      expect(speaker.avatarURL).toBeTruthy();
      expect(speaker.bio).toBeTruthy();
      expect(speaker.blog).toBeTruthy();
      expect(speaker.company).toBeTruthy();
      expect(speaker.firstName).toBeTruthy();
      expect(speaker.lang).toBeTruthy();
      expect(speaker.twitter).toBeTruthy();
    });
  });
});
