const fillGaps = (number: number): string[] => {
  let array = number.toString().split("");
  for (let i = array.length; i < 7; i++) {
    array.unshift("0");
  }
  return array;
};
export default fillGaps;
