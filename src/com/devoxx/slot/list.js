const { getListOfSlots } = require("src/services/schedule");

module.exports = app => {
  
  getListOfSlots()
    .then(data => {
      app.ask(`found ${data.length} items`);
      console.log(data);
    });

};
