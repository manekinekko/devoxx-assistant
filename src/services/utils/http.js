const fetch = require('node-fetch');
const API_ENDPOINT = `https://cfp.devoxx.be/api/conferences/DVBE17`;

module.exports = (url = '') => {
    console.log('fetching ', `${API_ENDPOINT}${url}`);
    return fetch(`${API_ENDPOINT}${url}`)
        .then(rawResponse => rawResponse.text())
        .then(textResponse => JSON.parse(textResponse));
}