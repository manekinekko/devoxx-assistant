const devoxxApi = require('./utils/http');
let __CACHE = [];

module.exports = () => {
    let schedules = [];

    if (__CACHE.length > 0) {
        return Promise.resolve(__CACHE);
    }

    return devoxxApi( /* root api */ ).then(data => {

        // SchduleObject = {
        //   proposalTypesId: [''],
        //   label: '',
        //   localisation: '',
        //   days: [''],
        //   locale: ['']
        // }

        // get the schedule of each day
        const conferenceDyas = data.days.map(day => devoxxApi(`/schedules/${day.toLowerCase()}`));

        // run once and cache the result
        return Promise.all(conferenceDyas)
            .then(data => data.map(d => d.slots))
            .then(slots => {
                __CACHE = [].concat(...slots);
                return __CACHE;
            });
    });
}