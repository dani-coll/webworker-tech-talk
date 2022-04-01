/// <reference lib="webworker" />

import {longCalculation, WebWorkerData} from './calculator.utils';


addEventListener('message', ({ data } : {data: WebWorkerData}) => {
  const {action, x, y, buffer} = data;
  switch(action) {
    case 'hello':
      postMessage('CPU Usage %');
    break;
    case 'calculate':
      postMessage(longCalculation(0, 0, x, y));
    break;
    case 'calculate-1/2':
      postMessage(longCalculation(0, 0, x/2, y));
    break;
    case 'calculate-2/2':
      postMessage(longCalculation(x/2, 0, x, y));
    break;
    case 'calculate-1/2-shared':
      const firstBuffer = new Int32Array(buffer);
      const firstResult = longCalculation(0, 0, x/2, y);

      Atomics.wait(firstBuffer, 0, 0)
      const storedResult = Atomics.load(firstBuffer, 0);
      console.log("I've received from my friend: " + storedResult)

      Atomics.add(firstBuffer, 0, firstResult);
      const finalResult = Atomics.load(firstBuffer, 0);
      console.log("Total: " + finalResult)
      postMessage(finalResult)
    break;
    case 'calculate-2/2-shared':
      const secondBuffer = new Int32Array(data.buffer);
      const secondResult = longCalculation(x/2, 0, x, y);

      Atomics.store(secondBuffer, 0, secondResult);
      Atomics.notify(secondBuffer, 0, 1);
    break;
    default:
  }
});
