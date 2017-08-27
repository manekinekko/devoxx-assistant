#!/usr/bin/env node

const argv = require('optimist')
    .demand('i')
    .usage('Test an intent locally.\nUsage: ./test.js -i=[intent_name]')
    .argv;
const intent = argv.i;

if (intent) {
    const testApp = {
        SurfaceCapabilities: {
            SCREEN_OUTPUT: false
        },
        hasSurfaceCapability(capa) { return false },
        getArgument() { return '' },
        ask(text) { console.log(text) },
        tell(text) { console.log(text) }
    };
    require(`./src/intents/${intent}`)(testApp);
} else {
    process.exit(-1);
}