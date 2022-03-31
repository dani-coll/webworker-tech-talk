/// <reference lib="webworker" />

import {longCalculation} from './calculator.utils';

addEventListener('message', ({ data }) => {
  switch(data.action) {
    case 'hello':
      postMessage('CPU Usage %');
    break;
    case 'calculate':
      postMessage(longCalculation());
    break;
    case 'calculate-1/2':
      postMessage(longCalculation(0, 0, 25000));
    break;
    case 'calculate-2/2':
      postMessage(longCalculation(25000, 0, 50000));
    break;
    default:
  }
});
