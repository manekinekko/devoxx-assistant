const { devoxxApi } = require("./utils/http");

module.exports = () => {
  return devoxxApi(`/tracks`).then(data => {
    // TrackObject = {
    //     id: '',
    //     imgsrc: '',
    //     title: '',
    //     description: ''
    // };

    const tracks = data.tracks;

    tracks.map(track => {
      track.title = track.title.replace(/(&amp;)/g, "&");
      return track;
    });

    return tracks;
  });
};
