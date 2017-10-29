const {take} = require('./array');

describe('Array utilities', () => {

  it('take 3 random items', () => {
    const array = [2,4,6,8,7,6,9];
    expect(take(array, 3).length).toBe(3);
  });
})