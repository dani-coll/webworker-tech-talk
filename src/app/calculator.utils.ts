export function longCalculation(i = 0, j = 0, iMax = 50000, jMax = 40000): number {
  let result = 0;
  for(i; i < iMax; ++i) {
    for(j = 0; j < jMax; ++j) {
      if(i < j ) {
        result +=j
      } else {
        result += j*i
      }
    }
  }
  return result;
}
