const fetch = require('node-fetch');
module.exports = (url = '') => {
    return fetch(`https://cfp.devoxx.be/api/conferences/DVBE17/${url}`)
        .then(rawResponse => rawResponse.text())
        .then(textResponse => JSON.parse(textResponse));
}