module.exports.filter = (predicat, comparator) => collection =>
  predicat(collection, comparator);

module.exports = class Predicates {
  static filter(collection, predicat, comparator) {
    return predicat(collection, comparator);
  }

  static byTrackId(collection, id) {
    return collection.filter(slot => slot.talk && slot.talk.trackId === id);
  }

  static byTalkId(collection, id) {
    return collection.filter(slot => slot.talk && slot.talk.id === id);
  }

  static byTalkName(collection) {
    return collection
      .filter(slot => slot.talk)
      .map(slot => slot.talk.title.trim());
  }

  static byTalkTrack(collection) {
    collection = collection
      .filter(slot => slot.talk)
      .map(slot => slot.talk.track.trim().replace("&amp;", "and"));
    return [...new Set(collection)];
  }

  static byTalkTrackPopular(collection, maxElements) {
    collection = collection
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
    for (let pair of collection) {
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

  static byTalkType(collection) {
    collection = collection
      .filter(slot => slot.talk)
      .map(slot => slot.talk.talkType.trim());
    return [...new Set(collection)];
  }

  static byRoom(collection) {
    collection = collection
      .filter(slot => slot.talk)
      .map(slot => slot.roomName.trim());
    return [...new Set(collection)];
  }

  static bySpeaker(collection) {
    const speakers = collection
      .filter(slot => slot.talk)
      .map(slot => slot.talk.speakers.map(speaker => speaker.name.trim()).pop())
      .sort();
    return new Set(speakers);
  }

  static byTag(collection, tag) {
    return collection
      .filter(slot => slot.talk)
      .filter(slot =>
        slot.talk.tags.some(ctag =>
          ctag.value.toLowerCase().includes(tag.toLowerCase())
        )
      );
  }

  static filterByTag(tag) {
    return slots =>
      Predicates.filter(slots, Predicates.byTag, tag.toLocaleLowerCase());
  }

  static byRoomName(collection, roomName) {
    return collection
      .filter(slot => slot.talk)
      .filter(slot =>
        slot.roomName.toLowerCase().includes(roomName.toLowerCase())
      );
  }

  static filterByRoom(roomName) {
    return slots =>
      Predicates.filter(
        slots,
        Predicates.byRoomName,
        roomName.toLocaleLowerCase()
      );
  }

  static byDay(collection, day) {
    return collection
      .filter(slot => slot.talk)
      .filter(slot => slot.day.toLowerCase().includes(day.toLowerCase()));
  }

  static filterByDay(day) {
    return slots =>
      Predicates.filter(slots, Predicates.byDay, day.toLocaleLowerCase());
  }

  static byTopic(collection, topic) {
    const talks = collection.filter(slot => {
      return (
        slot.talk &&
        slot.talk.track.toLowerCase().indexOf(topic.toLowerCase()) !== -1
      );
    });
    if (talks.length > 0) {
      return talks.map(slot => slot.talk);
    } else {
      return [];
    }
  }
};
