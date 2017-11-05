Array.prototype.join = function join(separator, lastSeparator) {
  if (this.length === 0) {
    return "";
  } else if (this.length === 1) {
    return `${this[0]}`;
  } else if (this.length === 2) {
    return `${this[0]} ${lastSeparator} ${this[1]}`;
  } else if (this.length > 2) {
    let join = `${this[0]}`;
    for (let i = 1; i < this.length-1; i++) {
      join = `${join}${separator}${this[i]}`;
    }
    lastSeparator = lastSeparator || separator;
    return `${join}${lastSeparator}${this.pop()}`;
  }
};

function take(array, number) {
  number = Math.min(array.length, number);
  return range(shuffle(array), 0, number);
}

function range(array, start, end) {
  return array.slice(start, end);
}

function shuffle(array) {
  if (array.length === 0) {
    return [];
  }
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = {
  take,
  range,
  shuffle
};
