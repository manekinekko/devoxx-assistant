const { getListOfSlots } = require("src/services/schedule");

module.exports = app => {
  if (app.getUserConfirmation()) {

    const talkId = app.data.talkId;

    getListOfSlots()
      .then(slots => slots.map(slot => slot.talk.id === talkId))
      .then(talk => {

        app.debug('found talk');
        app.debug(talk);
        app.ask(`more details about a talk`);

      });

  } else {
    app.ask('Sure. What else can I do for you?');
  }
}