const devoxxApi = require("./utils/http");

module.exports = () => {
  return devoxxApi(/* root api */).then(data => {

    // SchduleObject = {
    //   proposalTypesId: [''],
    //   label: '',
    //   localisation: '',
    //   days: [''],
    //   locale: ['']
    // }

    // get the schedule of each day
    const conferenceDyas = data.days.map(day => devoxxApi(`/schedules/${day.toLowerCase()}`));

    return Promise.all(conferenceDyas)
      .then(data => data.map(d => d.slots))
      .then(slots => [].concat(...slots));
  });
};
