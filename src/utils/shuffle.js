export default function Shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;
  let copy1;
  let copy2;
  const target = array;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    copy1 = target[currentIndex];
    copy2 = target[randomIndex];
    target[randomIndex] = copy1;
    target[currentIndex] = copy2;
  }

  return target;
}
