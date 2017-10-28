const schedule = require("src/services/schedule");

module.exports = app => {
  
  schedule()
    .then(data => {
      app.ask(`found ${data.length} items`);
      console.log(data);
    });

};
