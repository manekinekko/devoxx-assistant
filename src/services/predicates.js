module.exports.filter = (predicat, comparator) => slots =>
  predicat(slots, comparator);

module.exports = class Predicates {
  static filter(slots, predicat, comparator) {
    return predicat(slots, comparator);
  }

  static byTrackId(slots, id) {
    return slots.filter(slot => slot.talk && slot.talk.trackId === id);
  }

  static byTalkId(slots, id) {
    return slots.filter(slot => slot.talk && slot.talk.id === id);
  }

  static byTalkName(slots) {
    return slots.filter(slot => slot.talk).map(slot => slot.talk.title.trim());
  }

  static byTalkTrack(slots) {
    slots = slots
      .filter(slot => slot.talk)
      .map(slot => slot.talk.track.trim().replace("&amp;", "and"));
    return [...new Set(slots)];
  }

  static byTalkTrackPopular(slots, maxElements) {
    slots = slots
      .filter(slot => slot.talk)
      .map(slot => slot.talk.track.trim().replace("&amp;", "and"))
      .reduce((acc, topic) => {
        return acc.set(topic, (acc.get(topic) || 0) + 1);
      }, new Map());

    /**
         * schedule: Map<string, number> ={
         *      { 'Mind the Geek' => 2 },
         *      { 'Security' => 1 },
         *      { 'Architecture' => 4 },
         *      { ... } 
         * }
         */
    let acc = [];
    for (let pair of slots) {
      acc.push(pair);
    }
    /**
         * acc: [][] = [
         *      [ 'Mind the Geek', 3 ],
         *      [ 'Security', 1 ],
         *      [ 'Architecture', 4 ],
         *      [ ... ]
         * ]
         */
    acc = acc.sort((a, b) => (a[1] > b[1] ? -1 : 1));
    /**
         * sort acc by count (in reverse order)
         * acc: [][] = [
         *      [ 'Architecture', 4 ],
         *      [ 'Mind the Geek', 3 ],
         *      [ 'Security', 1 ],
         *      [ ... ]
         * ]
         */
    return acc.slice(0, maxElements);
  }

  static byTalkType(slots) {
    slots = slots
      .filter(slot => slot.talk)
      .map(slot => slot.talk.talkType.trim());
    return [...new Set(slots)];
  }

  static byRoom(slots) {
    slots = slots.filter(slot => slot.talk).map(slot => slot.roomName.trim());
    return [...new Set(slots)];
  }

  static bySpeaker(slots) {
    const speakers = slots
      .filter(slot => slot.talk)
      .map(slot => slot.talk.speakers.map(speaker => speaker.name.trim()).pop())
      .sort();
    return new Set(speakers);
  }

  static byTag(slots, tag) {
    return slots
      .filter(slot => slot.talk)
      .filter(slot =>
        slot.talk.tags.some(ctag =>
          ctag.value.toLowerCase().includes(tag.toLowerCase())
        )
      );
  }

  static filterByTag(tag) {
    if (!tag) {
      return slots;
    }
    return slots =>
      Predicates.filter(slots, Predicates.byTag, tag.toLocaleLowerCase());
  }

  static byRoomName(slots, roomName) {
    if (!roomName) {
      return slots;
    }
    return slots
      .filter(slot => slot.talk)
      .filter(slot =>
        slot.roomName.toLowerCase().includes(roomName.toLowerCase())
      );
  }

  static filterByRoom(roomName) {
    return slots => Predicates.filter(slots, Predicates.byRoomName, roomName);
  }

  static byDay(slots, day) {
    return slots
      .filter(slot => slot.talk)
      .filter(slot => slot.day.toLowerCase().includes(day.toLowerCase()));
  }

  static filterByDay(day) {
    return slots =>
      Predicates.filter(slots, Predicates.byDay, day.toLocaleLowerCase());
  }

  static byTopic(slots, topic) {
    return slots
      .filter(slot => {
        return (
          slot.talk &&
          slot.talk.track.toLowerCase().includes(topic.toLowerCase())
        );
      })
      .map(slot => slot.talk);
  }

  static byTime(slots, [currentTime, date = null]) {
    if (!currentTime || currentTime < 0) {
      return slots;
    }

    const moment = require("moment");
    currentTime = moment(currentTime);

    if (
      currentTime.hours() === 0 &&
      currentTime.minute() === 0 &&
      currentTime.second() === 0
    ) {
      // the user hadn't provide a time (just a day, so skip)
      return slots;
    }

    if (date) {
      date = moment(date);
    }

    return slots.filter(slot => {
      // if the user had provided a day ("2017-11-08"), use it
      // otherwise, use the current day from slot.
      // in both case, use the same "currentTime" that the user had provided
      if (date) {
        date = moment(slot.fromTimeMillis);
      }
      
      // currentTime = moment({
      //   day: date.day()-1,
      //   month: date.month()+1,
      //   year: date.year(),
      //   hours: currentTime.hours(),
      //   minute: currentTime.minute(),
      //   second: currentTime.second()
      // });
      currentTime = moment(`${date.format("YYYY-MM-DD")}T${currentTime.format("HH:mm:SS[.]SSSS")}`);

      const fromTime = moment(slot.fromTimeMillis);
      const toTime = moment(slot.toTimeMillis);
      const talkLength = toTime.diff(fromTime, "minute");

      const inclusive = "[]";
      const isInBewtee = moment(currentTime).isBetween(
        fromTime,
        toTime,
        "minute",
        inclusive
      );

      console.log(currentTime, talkLength, fromTime, toTime, isInBewtee);
      return isInBewtee;
    });
  }

  static filterByTime([time = null, date = null]) {
    return slots => Predicates.filter(slots, Predicates.byTime, [time, date]);
  }
};
