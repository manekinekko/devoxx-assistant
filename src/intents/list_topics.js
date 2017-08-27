// @ts-check
const topics = require('../services/topics');

module.exports = (app) => {

    topics().then(topics => {

            if (topics.length === 0) {
                app.tell(`It seems there is no topic available yet. You might want to try later.`);
            } else {

                if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
                    // show a carousel with the tracks icons
                } else {
                    const titles = topics.map(topic => topic.title);

                    // @todo(wch): should we add followup intents here?
                    // ex: 
                    // -->  bot: whould you like to know more about a particular topic?
                    // --> user: yes
                    // -->  bot: what topic?
                    // --> user: tell me more about "Modern Web"

                    app.tell(`I found the following topics: ${ titles.join(' ') }.`);
                }

            }

        })
        .catch(e => {
            console.error(e);
            app.tell(`Oops! Something went wrong while fetching the topics list. Please try again.`);
        })

}