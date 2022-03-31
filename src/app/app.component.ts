import { Component } from '@angular/core';
import { longCalculation } from './calculator.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webworker-tech-talk';

  results: number[] = [];
  calcTimes: number[] = [];
  x = 40000;
  y = 50000;

  onCheck() {
    const worker = new Worker(new URL('./calculator.worker', import.meta.url));
    worker.onmessage = ({ data }) => {
      alert(`Web Worker says: \n ${data}`);
    };

    worker.postMessage({action: 'hello'});
  }

  onPerform() {
    const start = new Date().getTime();
    this.results.unshift(longCalculation(0, 0, this.x, this.y));
    this.calcTimes.unshift(new Date().getTime() - start);
  }

  onPerformTimeout() {
    const start = new Date().getTime();
    setTimeout(() => {
      this.results.unshift(longCalculation(0, 0, this.x, this.y));
      this.calcTimes.unshift(new Date().getTime() - start);
    });
  }

  onPerformWebWorker() {
    const start = new Date().getTime();
    const worker = new Worker(new URL('./calculator.worker', import.meta.url));
    worker.onmessage = ({ data }) => {
      this.results.unshift(data);
      this.calcTimes.unshift(new Date().getTime() - start);
    };

    worker.postMessage({action: 'calculate', x: this.x, y: this.y});
  }

  onPerformWebWorkerParallel() {
    const start = new Date().getTime();
    const worker1 = new Worker(new URL('./calculator.worker', import.meta.url));
    const worker2 = new Worker(new URL('./calculator.worker', import.meta.url));

    let partialResult: number;
    worker1.onmessage = ({ data }) => {
      if(partialResult != undefined) {
        this.results.unshift(partialResult + data);
        this.calcTimes.unshift(new Date().getTime() - start);
      } else {
        partialResult = data;
      }
    };

    worker2.onmessage = ({ data }) => {
      if(partialResult != undefined) {
        this.results.unshift(partialResult + data);
        this.calcTimes.unshift(new Date().getTime() - start);
      } else {
        partialResult = data;
      }
    };

    worker1.postMessage({action: 'calculate-1/2', x: this.x, y: this.y});
    worker2.postMessage({action: 'calculate-2/2', x: this.x, y: this.y});
  }

  onPerformWebWorkerArrayBuffer() {
    const buffer = new SharedArrayBuffer(4);

    const start = new Date().getTime();

    const firstWorker = new Worker(new URL('./calculator.worker', import.meta.url));
    firstWorker.onmessage = ({ data }) => {
      this.results.unshift(data);
      this.calcTimes.unshift(new Date().getTime() - start);
    };

    const secondWorker = new Worker(new URL('./calculator.worker', import.meta.url));

    firstWorker.postMessage({action: 'calculate-1/2-shared', buffer, x: this.x, y: this.y});
    secondWorker.postMessage({action: 'calculate-2/2-shared', buffer, x: this.x, y: this.y});
  }
}
