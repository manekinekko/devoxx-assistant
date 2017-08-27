const devoxxApi = require('./utils/http');
let __CACHE = [];

module.exports = () => {
    return devoxxApi(`tracks`)
        .then(data => {

            // TrackObject = {
            //     id: '',
            //     imgsrc: '',
            //     title: '',
            //     description: ''
            // };

            return data.tracks;
        });
}