
// Fisher–Yates Shuffle from https://bost.ocks.org/mike/shuffle/
export function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

export function randInt(min, max) {
  min = Math.ceil(min);
  if (max === undefined) {
    max = min;
    min = 0
  } else {
    max = Math.ceil(max) - min;
  }
  return Math.floor(Math.random() * max + min);
}

export function rand(min, max) {
  if (max === undefined) {
    max = min;
    min = 0
  }
  return Math.random() * (max - min) + min;
}

export function randBool() {
  return Math.random() >= 0.5;
}

export function randPick(...args) {
  if (args.length === 1 && args?.length > 0) args = args[0];
  return args[Math.floor(Math.random() * args.length)];
}
