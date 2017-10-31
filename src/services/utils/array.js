
function take(array, number) {
  number = Math.min(array.length, number);
  return range( shuffle(array), 0, number);
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