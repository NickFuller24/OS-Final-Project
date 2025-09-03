// This file is the "BE" of the app

export class Process {
  name: string;
  arrivalTime: number;
  totalCPUTime: number;
  remainingCPUTime: number;
  turnaroundTime: number;
  startTime: number;
  endTime: number;
  line: number;
  processCount: number;
  color: string;

  constructor(name: string, arrival: number, total: number) {
    this.name = name;
    this.arrivalTime = arrival;
    this.totalCPUTime = total;
    this.remainingCPUTime = total;
    this.turnaroundTime = 0;
    this.startTime = 0;
    this.endTime = 0;
    this.line = 0;
    this.processCount = 0;
    this.color = "#2D3047";
  }
}

export const p1 = new Process("p1", 1, 6);
export const p2 = new Process("p2", 2, 3);
export const p3 = new Process("p3", 4, 2);

export const gridData = [p1, p2, p3];

export const FIFO = (args: Process[]) => {
  // complete is true when all processes are done

  //carters untyped stuff
  const FIFOGridData: any = [];
  //-------

  let complete: boolean = false;
  let queue: Process[] = []; // shallow copy of args
  let running: boolean = false;
  let runningProcess!: Process;
  let timer: number = 0;
  let runningProcessIterator: number = 0;
  let avgTurnaroundTime: number = 0;
  const numOfProcesses: number = args.length;

  // copy args to queue
  args.forEach((process) => queue.push(Object.assign({}, process)));
  // for (let i = 0; i < args.length; i++) {
  //   FIFOGridData[args[i].name] = args[i];
  // }

  // sort queue based on arrival time:
  //  - if 1 is returned, p2 is sorted before p1 (p2.arrival < p1.arrival)
  //  - if -1 is returned, p1 is sorted before p2 (p1.arrival < p2.arrival)
  queue.sort((p1, p2) => (p1.arrivalTime >= p2.arrivalTime ? 1 : -1));
  // FIFOGridData.push(queue);
  console.log("hello", queue[0]);

  // run until all processes are finished running
  while (!complete) {
    if (queue.length > 0) {
      // take next process in queue and place it in running if no process is running,
      // otherwise, wait until process is done
      if (running === false) {
        // a process can only run once it has arrived
        if (queue[0].arrivalTime <= timer) {
          running = true;
          runningProcess = queue.shift()!;

          FIFOGridData.push(runningProcess);
          FIFOGridData[runningProcessIterator].processCount = numOfProcesses;
          FIFOGridData[runningProcessIterator].line = parseInt(
            FIFOGridData[runningProcessIterator].name.replace(/\D/g, "")
          );

          console.log("%s is running at time %d", runningProcess.name, timer);
          FIFOGridData[runningProcessIterator].startTime = timer;
        } else {
          console.log("nothing is running at time %d", timer);
        }
      }
    } else {
      console.log("queue is empty!");
    }

    // increment "timer"
    timer++;

    // if no process is running, then don't touch the runningProcess (because
    // there is no running process...)
    if (running === true) {
      // decrement remaining time of running process
      runningProcess.remainingCPUTime--;
      // console.log(runningProcess);

      // do we need a new process?
      if (runningProcess.remainingCPUTime === 0) {
        running = false;
        runningProcess.turnaroundTime = timer - runningProcess.arrivalTime;
        console.log(
          "%s is done running at time %d",
          runningProcess.name,
          timer
        );
        FIFOGridData[runningProcessIterator].endTime = timer;
        avgTurnaroundTime += runningProcess.turnaroundTime;
        runningProcessIterator++;

        // FIFOGridData.push([runningProcess, timer]);
        // FIFOGridData[runningProcess.name] = FIFOGridData[
        //   runningProcess.name
        // ].arrivalTime = timer;
      }
    }

    if (queue.length === 0 && running === false) {
      complete = true;
      console.log("we're done!");
      console.log("Total Time: %d", timer);

      avgTurnaroundTime = avgTurnaroundTime / numOfProcesses;
      console.log("Average Turnaround Time: %f", avgTurnaroundTime);
    }
  }

  console.log("DATA HERE:", FIFOGridData);
  return FIFOGridData;
};

// Shortest Job First:
// With the SJF algorithm, there is no pre-emption. A process will run until
// it is completely done, then the next process in the queue will run.
export const SJF = (args: Process[]) => {
  // complete is true when all processes are done

  //carters untyped stuff
  const SJFGridData: any = [];
  //-------

  let complete: boolean = false;
  let copyArgs: Process[] = [];
  let queue: Process[] = [];
  let running: boolean = false;
  let runningProcess!: Process;
  let timer: number = 0;
  let avgTurnaroundTime: number = 0;
  const numOfProcesses: number = args.length;
  let runningProcessIterator: number = 0;
  let remainingProcesses: number = args.length;

  // copy args so we don't modify the processes (useful when multile algos
  // are running with the same processes)
  args.forEach((process) => copyArgs.push(Object.assign({}, process)));

  // run until all processes are finished running
  while (!complete) {
    // if a process has arrived, add it to the queue and sort the queue
    // based on total time
    for (let i = 0; i < copyArgs.length; i++) {
      if (timer === copyArgs[i].arrivalTime) {
        // add to queue
        queue.push(copyArgs[i]);

        // decrement number of remaining processes
        remainingProcesses--;

        if (queue.length > 1) {
          // re-order if necessary
          //  - if 1 is returned, p2 is sorted before p1 (p2.total < p1.total)
          //  - if -1 is returned, p1 is sorted before p2 (p1.total < p2.total)
          queue.sort((p1, p2) => (p1.totalCPUTime >= p2.totalCPUTime ? 1 : -1));
          // console.log(queue);
        }
      }
    }

    // take next process in queue and place it in running if no process is running,
    // otherwise, wait until process is done
    if (running === false) {
      // can only run a process if it's ready
      if (queue.length > 0) {
        running = true;
        runningProcess = queue.shift()!;
        SJFGridData.push(runningProcess);
        SJFGridData[runningProcessIterator].processCount = numOfProcesses;
        SJFGridData[runningProcessIterator].line = parseInt(
          SJFGridData[runningProcessIterator].name.replace(/\D/g, "")
        );

        console.log("%s is running at time %d", runningProcess.name, timer);

        SJFGridData[runningProcessIterator].startTime = timer;
      } else {
        console.log("nothing is running at time %d", timer);
      }
    }

    // increment "timer"
    timer++;

    // if no process is running, then don't touch the runningProcess (because
    // there is no running process...)
    if (running === true) {
      // decrement remaining time of running process
      runningProcess.remainingCPUTime--;

      // do we need a new process?
      if (runningProcess.remainingCPUTime === 0) {
        running = false;
        runningProcess.turnaroundTime = timer - runningProcess.arrivalTime;
        console.log(
          "%s is done running at time %d",
          runningProcess.name,
          timer
        );
        SJFGridData[runningProcessIterator].endTime = timer;
        avgTurnaroundTime += runningProcess.turnaroundTime;
        runningProcessIterator++;
        console.log(runningProcess);
      }
    }

    // We are done if all of the following are true:
    //  - ready queue is empty
    //  - there isn't anything running
    //  - there aren't any more processes waiting to arrive
    if (queue.length === 0 && running === false && remainingProcesses === 0) {
      complete = true;
      console.log("we're done!");
      console.log("Total Time: %d", timer);

      avgTurnaroundTime = avgTurnaroundTime / numOfProcesses;
      console.log("Average Turnaround Time: %f", avgTurnaroundTime);
    }
  }
  return SJFGridData;
};

// Shortest Remaining Time:
// With the SRT algorithm, the cpu will check the queue when a new process
// arrives or when a process completes. This is the pre-emptive version of
// SJF so it can stop the currently executing process if a newly arrived
// process requires less total CPU Time.
export const SRT = (args: Process[]) => {
  //carters untyped stuff
  const SRTGridData: any = [];
  //-------

  let complete: boolean = false;
  let copyArgs: Process[] = [];
  let queue: Process[] = [];
  let running: boolean = false;
  let runningProcess!: Process;
  let timer: number = 0;
  let avgTurnaroundTime: number = 0;
  const numOfProcesses: number = args.length;
  let addedProcess: boolean = false;
  let runningProcessIterator: number = 0;
  let remainingProcesses: number = args.length;

  // copy args so we don't modify the processes (useful when multile algos
  // are running with the same processes)
  args.forEach((process) => copyArgs.push(Object.assign({}, process)));

  // run until all processes are finished running
  while (!complete) {
    addedProcess = false;

    // if a process has arrived, add it to the queue and sort the queue
    // based on total time
    for (let i = 0; i < copyArgs.length; i++) {
      if (timer === copyArgs[i].arrivalTime) {
        // add to queue
        queue.push(copyArgs[i]);
        addedProcess = true;

        // decrement number of remaining processes
        remainingProcesses--;

        if (queue.length > 1) {
          // re-order if necessary
          //  - if 1 is returned, p2 is sorted before p1 (p2.total < p1.total)
          //  - if -1 is returned, p1 is sorted before p2 (p1.total < p2.total)
          queue.sort((p1, p2) => (p1.remainingCPUTime >= p2.remainingCPUTime ? 1 : -1));
          // console.log(queue);
        }
      }
    }

    // if a process arrived, check to see if a different process should
    // be running; i.e. check to see if there is a process whose remaining
    // cpu time is less than the running process.
    if (addedProcess && running === true) {
      if (queue[0].remainingCPUTime < runningProcess.remainingCPUTime) {
        // swap the current running process and the process first in queue
        SRTGridData[runningProcessIterator].endTime = timer;

        runningProcessIterator++;

        const temp: Process = new Process("temp", 0, 0);
        temp.arrivalTime = runningProcess.arrivalTime;
        temp.endTime = runningProcess.endTime;
        temp.line = runningProcess.line;
        temp.name = runningProcess.name;
        temp.processCount = runningProcess.processCount;
        temp.remainingCPUTime = runningProcess.remainingCPUTime;
        temp.totalCPUTime = runningProcess.totalCPUTime;
        temp.turnaroundTime = runningProcess.turnaroundTime;
        temp.startTime = runningProcess.startTime;

        console.log("%s is moved back to queue at time %d", temp.name, timer);
        queue.push(temp);

        runningProcess = queue.shift()!;
        SRTGridData.push(runningProcess);
        SRTGridData[runningProcessIterator].processCount = numOfProcesses;
        SRTGridData[runningProcessIterator].line = parseInt(
          SRTGridData[runningProcessIterator].name.replace(/\D/g, "")
        );
        SRTGridData[runningProcessIterator].startTime = timer;

        console.log("%s is running at time %d", runningProcess.name, timer);

        // re-order queue if necessary
        if (queue.length > 1) {
          queue.sort((p1, p2) => (p1.remainingCPUTime >= p2.remainingCPUTime ? 1 : -1));
        }
      }
    }

    // take next process in queue and place it in running if no process is running,
    // otherwise, wait until process is done
    if (running === false) {
      // can only run a process if it's ready
      if (queue.length > 0) {
        running = true;
        runningProcess = queue.shift()!;
        SRTGridData.push(runningProcess);
        SRTGridData[runningProcessIterator].processCount = numOfProcesses;
        SRTGridData[runningProcessIterator].line = parseInt(
          SRTGridData[runningProcessIterator].name.replace(/\D/g, "")
        );
        SRTGridData[runningProcessIterator].startTime = timer;
        console.log("%s is running at time %d", runningProcess.name, timer);
      } else {
        console.log("nothing is running at time %d", timer);
      }
    }

    // increment "timer"
    timer++;

    // if no process is running, then don't touch the runningProcess (because
    // there is no running process...)
    if (running === true) {
      // decrement remaining time of running process
      runningProcess.remainingCPUTime--;

      // do we need a new process?
      if (runningProcess.remainingCPUTime === 0) {
        running = false;
        runningProcess.turnaroundTime = timer - runningProcess.arrivalTime;
        console.log(
          "%s is done running at time %d",
          runningProcess.name,
          timer
        );
        avgTurnaroundTime += runningProcess.turnaroundTime;
        SRTGridData[runningProcessIterator].endTime = timer;
        runningProcessIterator++;
        console.log(runningProcess);
      }
    }

    // We are done if all of the following are true:
    //  - ready queue is empty
    //  - there isn't anything running
    //  - there aren't any more processes waiting to arrive
    if (queue.length === 0 && running === false && remainingProcesses === 0) {
      complete = true;
      console.log("we're done!");
      console.log("Total Time: %d", timer);

      avgTurnaroundTime = avgTurnaroundTime / numOfProcesses;
      console.log("Average Turnaround Time: %f", avgTurnaroundTime);
    }
  }

  return SRTGridData;
};

// Round Robin:
// With the RR algorithm, the running process is pre-emptively stopped
// and swapped with a process in the ready queue. When a process is moved
// from running to the queue, it will be placed at the bottom. Time quantum
// can be changed by user
export const RR = (timeQuantum: number, args: Process[]) => {
  const RRGridData: any = [];

  let complete: boolean = false;
  let copyArgs: Process[] = [];
  let queue: Process[] = [];
  let running: boolean = false;
  let runningProcess!: Process;
  let timer: number = 0;
  let counter: number = 0;
  let avgTurnaroundTime: number = 0;
  const numOfProcesses: number = args.length;
  let runningProcessIterator: number = 0;
  let remainingProcesses: number = args.length;

  // copy args so we don't modify the processes (useful when multile algos
  // are running with the same processes)
  args.forEach((process) => copyArgs.push(Object.assign({}, process)));
  console.log("time quantum:", timeQuantum);
  // run until all processes are finished running
  while (!complete) {
    // if a process has arrived, add it to the queue
    for (let i = 0; i < copyArgs.length; i++) {
      if (timer === copyArgs[i].arrivalTime) {
        // add to queue
        queue.push(copyArgs[i]);

        // decrement number of remaining processes
        remainingProcesses--;
      }
    }

    // take next process in queue and place it in running if no process is running,
    // otherwise, wait until process is done
    if (running === false) {
      // can only run a process if it's ready
      if (queue.length > 0) {
        running = true;
        runningProcess = queue.shift()!;
        console.log("%s is running at time %d", runningProcess.name, timer);

        RRGridData.push(runningProcess);
        RRGridData[runningProcessIterator].processCount = numOfProcesses;
        RRGridData[runningProcessIterator].line = parseInt(
          RRGridData[runningProcessIterator].name.replace(/\D/g, "")
        );
        RRGridData[runningProcessIterator].startTime = timer;
      } else {
        console.log("nothing is running at time %d", timer);
      }
    }

    // increment "timer"
    timer++;

    // if no process is running, then don't touch the runningProcess (because
    // there is no running process...)
    if (running === true) {
      // decrement remaining time of running process
      runningProcess.remainingCPUTime--;

      // increment counter to determine when we reach a time quantum
      counter++;
      console.log(counter);

      // is the process done?
      if (runningProcess.remainingCPUTime === 0) {
        running = false;
        runningProcess.turnaroundTime = timer - runningProcess.arrivalTime;
        console.log(
          "%s is done running at time %d",
          runningProcess.name,
          timer
        );

        avgTurnaroundTime += runningProcess.turnaroundTime;

        RRGridData[runningProcessIterator].endTime = timer;
        runningProcessIterator++;
        console.log(runningProcess);

        // reset counter since the process is no longer running
        counter = 0;
      }

      // swap the process if we've reached the next time quantum
      if (counter === timeQuantum && queue.length > 0) {
        RRGridData[runningProcessIterator].endTime = timer;

        runningProcessIterator++;

        const temp: Process = new Process("temp", 0, 0);
        temp.arrivalTime = runningProcess.arrivalTime;
        temp.endTime = runningProcess.endTime;
        temp.line = runningProcess.line;
        temp.name = runningProcess.name;
        temp.processCount = runningProcess.processCount;
        temp.remainingCPUTime = runningProcess.remainingCPUTime;
        temp.totalCPUTime = runningProcess.totalCPUTime;
        temp.turnaroundTime = runningProcess.turnaroundTime;
        temp.startTime = runningProcess.startTime;

        console.log("%s is moved back to queue at time %d", runningProcess.name, timer);
        queue.push(temp);
        console.log(queue[0]);

        runningProcess = queue.shift()!;
        RRGridData.push(runningProcess);
        RRGridData[runningProcessIterator].processCount = numOfProcesses;
        RRGridData[runningProcessIterator].line = parseInt(
          RRGridData[runningProcessIterator].name.replace(/\D/g, "")
        );
        RRGridData[runningProcessIterator].startTime = timer;

        console.log("%s is running at time %d", runningProcess.name, timer);

        // reset counter since the process running is a new process
        counter = 0;
      } else if (counter === timeQuantum && queue.length === 0) {
        // reset counter so we make sure we keep checking for a swap
        // at each time quantum
        counter = 0;
        console.log("nothing in queue to swap with");
      }
    }

    // We are done if all of the following are true:
    //  - ready queue is empty
    //  - there isn't anything running
    //  - there aren't any more processes waiting to arrive
    if (queue.length === 0 && running === false && remainingProcesses === 0) {
      complete = true;
      console.log("we're done!");
      console.log("Total Time: %d", timer);

      avgTurnaroundTime = avgTurnaroundTime / numOfProcesses;
      console.log("Average Turnaround Time: %f", avgTurnaroundTime);
    }
  }
  return RRGridData;
};
