export interface WebWorkerData {
  action: string;
  buffer: SharedArrayBuffer;
  x: number;
  y: number;
}

export function longCalculation(i: number, j: number, iMax: number, jMax: number): number {
  let result = 0;
  for(i; i < iMax; ++i) {
    for(j = 0; j < jMax; ++j) {
      if(i < j ) {
        result += j
      } else {
        result += i
      }
    }
  }
  return result;
}
