const {
  getListOfSlots,
  listAllRooms,
  listAllTags,
  getTopicsByTrackId
} = require("./schedule");
const { getSpeakersByRoomName } = require("./speaker");
const { pbcopy, writeJSON } = require("./utils/node");
const Predicates = require("./predicates");
const { filter } = require("./predicates");

describe("testing schedule", () => {
  it("should list all topics", () => {
    expect.assertions(1);
    return getListOfSlots().then(slots => {
      writeJSON("src/services/__mock__/slots.json", slots);
      expect(slots.length).toBe(254);
    });
  });

  [0, 27, 41, 27, 23, 15, 20, 22, 19, 12, 16].map((expectedValue, index) => {
    it(`should return ${expectedValue} topics for trackId=track.${index}`, () => {
      expect.assertions(1);
      return getTopicsByTrackId(`track.${index}`).then(slots =>
        expect(slots.length).toBe(expectedValue)
      );
    });
  });

  it("should match 6 talks with 'performance' tag", () => {
    expect.assertions(1);
    return getListOfSlots()
      .then(slots => Predicates.filter(slots, Predicates.byTag, "performance"))
      .then(slots => {
        expect(slots.length).toBe(6);
      });
  });

  it("should match snapshot", () => {
    expect.assertions(1);
    return getListOfSlots().then(slots => expect(slots).toMatchSnapshot());
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
    expect.assertions(3);
    return getSpeakersByRoomName("Room 6").then(speakers => {
      // console.log(speakers);
      expect(speakers).toMatchSnapshot();
      expect(speakers[0].uuid).toBeTruthy();
      expect(speakers[0].firstName).toBeTruthy();
    });
  });
});
