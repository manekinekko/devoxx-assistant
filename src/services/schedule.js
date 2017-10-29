const devoxxApi = require("./utils/http");

module.exports.getSchedule = () => {
  return devoxxApi(/* root api */).then(data => {

    // SchduleObject = {
    //   proposalTypesId: [''],
    //   label: '',
    //   localisation: '',
    //   days: [''],
    //   locale: ['']
    // }

    // get the schedule of each day
    const conferenceDyas = data.days.map(day =>
      devoxxApi(`/schedules/${day.toLowerCase()}`)
    );

    return Promise.all(conferenceDyas)
      .then(data => data.map(d => d.slots))
      .then(slots => [].concat(...slots))
  });
};

module.exports.byTrackId = (trackId) => slot => slot.talk && slot.talk.trackId === trackId;