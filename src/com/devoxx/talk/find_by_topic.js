module.exports = (app) => {
    const talkType = app.getArgument('talk-type');
    const topic = app.getArgument('topic');

    app.ask(`I found this ${talkType} about ${topic}: <title>. Would you like to hear more about this talk or the next one?`);
}