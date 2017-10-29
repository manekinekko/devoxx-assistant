module.exports = app => {
  let selectedTalkId = app.getSelectedOption();

  app.ask(`find talk by ID=${selectedTalkId}`);
}