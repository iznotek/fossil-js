import { SimpleFossilTask } from '../types';
import { FossilError } from '../errors/fossil-error';
import { createLogger, OutputLogger } from '../fossil-logger';

type AnySimpleFossilTask = SimpleFossilTask<any>;

type TaskInProgress = {
   name: string;
   logger: OutputLogger;
   task: AnySimpleFossilTask;
}

export class TasksPendingQueue {

   private _queue: Map<AnySimpleFossilTask, TaskInProgress> = new Map();

   constructor(private logLabel = 'FossilExecutor') {
   }

   private withProgress(task: AnySimpleFossilTask) {
      return this._queue.get(task);
   }

   private createProgress (task: AnySimpleFossilTask): TaskInProgress {
      const name = TasksPendingQueue.getName(task.commands[0]);
      const logger = createLogger(this.logLabel, name);

      return {
         task,
         logger,
         name,
      };
   }

   push(task: AnySimpleFossilTask): TaskInProgress {
      const progress = this.createProgress(task);
      progress.logger('Adding task to the queue, commands = %o', task.commands);

      this._queue.set(task, progress);

      return progress;
   }

   fatal(err: FossilError) {
      for (const [task, {logger}] of Array.from(this._queue.entries())) {
         if (task === err.task) {
            logger.info(`Failed %o`, err);
            logger(`Fatal exception, any as-yet un-started tasks run through this executor will not be attempted`);
         } else {
            logger.info(`A fatal exception occurred in a previous task, the queue has been purged: %o`, err.message);
         }

         this.complete(task);
      }

      if (this._queue.size !== 0) {
         throw new Error(`Queue size should be zero after fatal: ${this._queue.size}`);
      }
   }

   complete(task: AnySimpleFossilTask) {
      const progress = this.withProgress(task);
      if (progress) {
         this._queue.delete(task);
      }
   }

   attempt(task: AnySimpleFossilTask): TaskInProgress {
      const progress = this.withProgress(task);
      if (!progress) {
         throw new FossilError(undefined, 'TasksPendingQueue: attempt called for an unknown task');
      }
      progress.logger('Starting task');

      return progress;
   }

   static getName (name = 'empty') {
      return `task:${name}:${++TasksPendingQueue.counter}`;
   }

   private static counter = 0;
}
