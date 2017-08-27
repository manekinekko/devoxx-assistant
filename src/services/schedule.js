const devoxxApi = require('./utils/http');
let __CACHE = [];

module.exports = () => {
    let schedules = [];

    if (__CACHE.length > 0) {
        return Promise.resolve(__CACHE);
    }

    schedules = devoxxApi( /* root api */ ).then(data => {

        // SchduleObject = {
        //   proposalTypesId: [''],
        //   label: '',
        //   localisation: '',
        //   days: [''],
        //   locale: ['']
        // }

        // get all days
        const conferenceDyas = data.days;

        // get the schedule of each day
        return conferenceDyas.map(day => {
            return devoxxApi(`schedules/${day}`)
        });
    });

    // run once and cache the result
    return Promise.all(schedules)
        .then(data => data.map(d => d.slots))
        .then(slots => {
            __CACHE = [].concat(...slots);
            return __CACHE;
        });
}