const fillGaps = (number: number): number[] => {
  let array = number.toString().split("");
  for (let i = array.length; i < 7; i++) {
    array.unshift("0");
  }
    return array.map((d) => parseInt(d));
};
export default fillGaps;
