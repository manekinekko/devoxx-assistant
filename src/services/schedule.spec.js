const {
  getSchedule,
  getSpeakersByRoomName,
  listAllRooms,
  listAllTags,
  getTopicsByTrackId
} = require("./schedule");
const { pbcopy, writeJSON } = require("./utils/node");
const Predicates = require("./predicates");
const { filter } = require("./predicates");

describe("testing schedule", () => {
  it("should list all topics", () => {
    expect.assertions(1);
    return getSchedule().then(slots => {
      writeJSON("src/services/__mock__/slots.json", slots);
      expect(slots.length).toBe(255);
    });
  });

  [0, 28, 40, 26, 24, 15, 20, 22, 19, 12, 17].map((expectedValue, index) => {
    it(`should return ${expectedValue} topics for trackId=track.${index}`, () => {
      expect.assertions(1);
      return getTopicsByTrackId(`track.${index}`).then(slots =>
        expect(slots.length).toBe(expectedValue)
      );
    });
  });

  it("should match 6 talks with 'performance' tag", () => {
    expect.assertions(1);
    return getSchedule()
      .then(slots => Predicates.filter(slots, Predicates.byTag, "performance"))
      .then(slots => {
        expect(slots.length).toBe(6);
      });
  });

  it("should match snapshot", () => {
    expect.assertions(1);
    return getSchedule().then(slots => expect(slots).toMatchSnapshot());
  });

  it("should list all rooms", () => {
    expect.assertions(1);
    return listAllRooms().then(rooms => {
      // pbcopy(JSON.stringify(rooms));
      // writeJSON("src/services/__mock__/rooms.json", rooms);
      expect(rooms).toMatchSnapshot();
    });
  });

  it("should list all tags", () => {
    expect.assertions(1);
    return listAllTags().then(uniquetags => {
      // pbcopy(JSON.stringify(uniquetags));
      // writeJSON("src/services/__mock__/tags.json", uniquetags);
      expect(uniquetags).toMatchSnapshot();
    });
  });

  it("should list speakers in 'Room 6'", () => {
    expect.assertions(2);
    return getSpeakersByRoomName("room 6").then(speakers => {
      // console.log(speakers);
      expect(speakers).toMatchSnapshot();
      expect(speakers[0].uuid).toBeTruthy();
    });
  });
});
