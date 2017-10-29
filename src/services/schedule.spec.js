const schedule = require("./schedule");

describe("testing schedule", () => {

  it("should list all topics", () => {
    expect.assertions(1);
    return schedule.getSchedule().then(slots => expect(slots.length).toBe(256));
  });

  [0, 30, 40, 26, 24, 15, 20, 22, 19, 12, 18].map( (expectedValue, index) => {
    
    it(`should return ${expectedValue} topics for trackId=track.${index}`, () => {
      expect.assertions(1);
      return schedule.getSchedule()
        .then(slots => slots.filter(schedule.byTrackId(`track.${index}`)))
        .then(slots => expect(slots.length).toBe(expectedValue));
    });

  });

  it("should match snapshot", () => {
    expect.assertions(1);
    return schedule.getSchedule().then(slots => expect(slots).toMatchSnapshot());
  });

});
