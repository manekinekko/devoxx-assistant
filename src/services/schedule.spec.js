const schedule = require("./schedule");
const Predicates = require("./predicates");

describe("testing schedule", () => {
  it("should list all topics", () => {
    expect.assertions(1);
    return schedule.getSchedule().then(slots => expect(slots.length).toBe(256));
  });

  [0, 30, 40, 26, 24, 15, 20, 22, 19, 12, 18].map((expectedValue, index) => {
    it(`should return ${expectedValue} topics for trackId=track.${index}`, () => {
      expect.assertions(1);
      return schedule
        .getSchedule()
        .then(slots => Predicates.filter(slots, Predicates.byTrackId, `track.${index}`))
        .then(slots => expect(slots.length).toBe(expectedValue));
    });
  });

  it.only("should match 6 talks with 'performance' tag", () => {
    expect.assertions(1);
    return schedule
      .getSchedule()
      .then(slots => Predicates.filter(slots, Predicates.byTag, 'performance'))
      .then(slots => {
        expect(slots.length).toBe(6);
      })
  });

  it("should match snapshot", () => {
    expect.assertions(1);
    return schedule
      .getSchedule()
      .then(slots => expect(slots).toMatchSnapshot());
  });

  it("should list all rooms", () => {
    expect.assertions(1);
    return schedule
      .getSchedule()
      .then(slots => slots.map(slot => slot.roomName))
      .then(rooms => new Set(rooms))
      .then(rooms => Array.from(rooms).sort())
      .then(rooms =>
        rooms.map(room => {
          return {
            value: room,
            synonyms: [room]
          };
        })
      )
      .then(rooms => {
        pbcopy(JSON.stringify(rooms));
        expect(rooms).toBeTruthy();
      });
  });

  it("should list all tags", () => {
    expect.assertions(1);
    return schedule
      .getSchedule()
      .then(slots => slots.filter(slot => slot.talk))
      .then(slots => slots.map(slot => slot.talk.tags))
      .then(tags => tags.reduce((p, tag) => p.concat(tag), []))
      .then(tags => tags.map(tag => tag.value))
      .then(values => values.filter(value => value !== ""))
      .then(values => values.sort())
      .then(values => new Set(values))
      .then(uniquetags => {
        const tags = Array.from(uniquetags).map(tag => {
          return {
            value: tag,
            synonyms: [tag]
          };
        });
        pbcopy(JSON.stringify(tags));
        expect(uniquetags).toBeTruthy();
      });
  });
});

function pbcopy(data) {
  var proc = require("child_process").spawn("pbcopy");
  proc.stdin.write(data);
  proc.stdin.end();
}
