import { Component } from '@angular/core';
import { longCalculation } from './calculator.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webworker-tech-talk';

  result = 0;
  calcTimes: number[] = [];

  onPerform() {
    const start = new Date().getTime();
    this.result = longCalculation();
    this.calcTimes.push(new Date().getTime() - start);
  }

  onPerformTimeout() {
    const start = new Date().getTime();
    setTimeout(() => {
      this.result = longCalculation();
      this.calcTimes.unshift(new Date().getTime() - start);
    });
  }

  onPerformWebWorker() {
    const start = new Date().getTime();
    const worker = new Worker(new URL('./calculator.worker', import.meta.url));
    worker.onmessage = ({ data }) => {
      console.log("hey")
      this.result = data;
      this.calcTimes.unshift(new Date().getTime() - start);
    };

    worker.postMessage({action: 'calculate'});
  }

  onPerformWebWorkerParallel() {
    const start = new Date().getTime();
    const worker1 = new Worker(new URL('./calculator.worker', import.meta.url));
    const worker2 = new Worker(new URL('./calculator.worker', import.meta.url));

    let partialResult: number;
    worker1.onmessage = ({ data }) => {
      if(partialResult != undefined) {
        this.result = partialResult + data;
        this.calcTimes.unshift(new Date().getTime() - start);
      } else {
        partialResult = data;
      }
    };

    worker2.onmessage = ({ data }) => {
      if(partialResult != undefined) {
        this.result = partialResult + data;
        this.calcTimes.unshift(new Date().getTime() - start);
      } else {
        partialResult = data;
      }
    };

    worker1.postMessage({action: 'calculate-1/2'});
    worker2.postMessage({action: 'calculate-2/2'});
  }

  onCheck() {
    const worker = new Worker(new URL('./calculator.worker', import.meta.url));
    worker.onmessage = ({ data }) => {
      alert(`Web Worker says: \n ${data}`);
    };

    worker.postMessage({action: 'hello'});
  }
}
