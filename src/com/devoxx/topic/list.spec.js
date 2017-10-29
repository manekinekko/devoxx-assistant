const list = require('./list');
const ActionaryTest = require('src/services/actionary').ActionaryTest;

describe.skip('list all topics', () => {

  it('call askWithList', () => {
    const askWithList = spyOn(ActionaryTest, 'askWithList');
    return list(ActionaryTest).then(_ => expect(askWithList).toHaveBeenCalled())
    
  });

})