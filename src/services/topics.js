const devoxxApi = require('./utils/http');
let __CACHE = [];

module.exports = () => {
    return devoxxApi(`/tracks`)
        .then(data => {

            // TrackObject = {
            //     id: '',
            //     imgsrc: '',
            //     title: '',
            //     description: ''
            // };
            const tracks = data.tracks;

            tracks.map(track => {
                track.title = track.title.replace(/(&amp;)/g, '&');
                return track;
            })

            // @todo(wch): should we limit this to 3 topics only?
            return tracks;
        });
}