// @ts-check
const topics = require('../services/topics');

module.exports = (app) => {

    topics().then(topics => {

            if (topics.length === 0) {
                app.tell(`It seems there is no topic available yet. You might want to try later.`);
            } else {

                if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
                    // show a carousel with the tracks icons

                    let list = app.buildList(`Here are the available topics:`);

                    for (let i = 0; i < topics.length; i++) {
                        const topic = topics[i];

                        list = list.addItems(
                            app.buildOptionItem(topic.id, [topic.id])
                            .setTitle(topic.title)
                            .setDescription(topic.description)
                            .setImage(`https://cfp.devoxx.be${topic.imgsrc}`, topic.imgsrc)
                        );

                        console.log('builing list with track', topic);
                    }

                    app.askWithList(`${list}. Which track are you interested in?`, list);

                } else {
                    const titles = topics.map(topic => topic.title);

                    // @todo(wch): should we add followup intents here?
                    // ex: 
                    // -->  bot: whould you like to know more about a particular topic?
                    // --> user: yes
                    // -->  bot: what topic?
                    // --> user: tell me more about "Modern Web"

                    app.tell(`I found the following topics: ${ titles.join(', ') }.`);
                }

            }

        })
        .catch(e => {
            console.error(e);
            app.tell(`Oops! Something went wrong while fetching the topics list. Please try again.`);
        })

}