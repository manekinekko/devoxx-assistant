const list = require('./list');
const ActionaryTest = require('src/services/actionary').ActionaryTest;

describe('list all topics', () => {

  it.skip('call askWithList', () => {
    const askWithList = spyOn(ActionaryTest, 'askWithList');
    return list(ActionaryTest).then(_ => expect(askWithList).toHaveBeenCalled());
  });

})