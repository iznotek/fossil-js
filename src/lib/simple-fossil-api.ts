import { PushResult, SimpleFossil, SimpleFossilBase, TaskOptions } from '../../typings';
import { taskCallback } from './task-callback';
import { changeWorkingDirectoryTask } from './tasks/change-working-directory';
import { pushTask } from './tasks/push';
import { configurationErrorTask, straightThroughStringTask } from './tasks/task';
import { SimpleFossilExecutor, SimpleFossilTask, SimpleFossilTaskCallback } from './types';
import { asArray, filterString, filterType, getTrailingOptions, trailingFunctionArgument } from './utils';

export class SimpleFossilApi implements SimpleFossilBase {
   private _executor: SimpleFossilExecutor;

   constructor(_executor: SimpleFossilExecutor) {
      this._executor = _executor;
   }

   private _runTask<T>(task: SimpleFossilTask<T>, then?: SimpleFossilTaskCallback<T>) {
      const chain = this._executor.chain();
      const promise = chain.push(task);

      if (then) {
         taskCallback(task, promise, then);
      }

      return Object.create(this, {
         then: {value: promise.then.bind(promise)},
         catch: {value: promise.catch.bind(promise)},
         _executor: {value: chain},
      });
   }

   add(files: string | string[]) {
      return this._runTask(
         straightThroughStringTask(['add', ...asArray(files)]),
         trailingFunctionArgument(arguments),
      );
   }

   cwd(directory: string | { path: string, root?: boolean }) {
      const next = trailingFunctionArgument(arguments);

      if (typeof directory === 'string') {
         return this._runTask(changeWorkingDirectoryTask(directory, this._executor), next);
      }

      if (typeof directory?.path === 'string') {
         return this._runTask(changeWorkingDirectoryTask(directory.path, directory.root && this._executor || undefined), next);
      }

      return this._runTask(
         configurationErrorTask('Fossil.cwd: workingDirectory must be supplied as a string'),
         next
      );
   }

   push(remote?: string, options?: TaskOptions, callback?: SimpleFossilTaskCallback<PushResult>): SimpleFossil & Promise<PushResult>;
   push(options?: TaskOptions, callback?: SimpleFossilTaskCallback<PushResult>): SimpleFossil & Promise<PushResult>;
   push(callback?: SimpleFossilTaskCallback<PushResult>): SimpleFossil & Promise<PushResult>;
   push() {
      const task = pushTask(
         {
            remote: filterType(arguments[0], filterString),
            branch: filterType(arguments[1], filterString),
         },
         getTrailingOptions(arguments),
      );

      return this._runTask(
         task,
         trailingFunctionArgument(arguments),
      );
   }
}
