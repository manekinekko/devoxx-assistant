const fetch = require("node-fetch");
const API_ENDPOINT = `https://cfp.devoxx.be/api/conferences/DVBE17`;

function devoxxApi(url = "") {
  return fetch(`${API_ENDPOINT}${url}`)
    .then(rawResponse => rawResponse.text())
    .then(textResponse => JSON.parse(textResponse))
    .catch(e => {
      throw new Error(`An error has occured when fetching ${url}.`);
    });
}

function devoxxApiMock(path) {
  try {
    return new Promise((resolve, reject) => {
      const content = require("fs").readFile(
        `src/services/__mock__/${path}.json`,
        (error, content) => {
          if (error) {
            reject(error);
          }
          resolve(JSON.parse(content));
        }
      );
    });
  }
  catch(e) {
    throw new Error(`An error has occured when readin ${path}.`);    
  }
}

module.exports = {
  devoxxApi,
  devoxxApiMock
};
