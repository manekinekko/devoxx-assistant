const schedule = require('../services/schedule');

module.exports = (app) => {
    let selectedItem = app.getContextArgument('actions_intent_option', 'OPTION').value;
    console.log('selectedItem::', 'selected track', selectedItem);

    if (selectedItem.indexOf('TRACK_') !== 0) {} else {
        schedule()
            .then(data => {
                console.log(data);
            })
            .catch(e => {
                console.error(e);
            })

    }
}