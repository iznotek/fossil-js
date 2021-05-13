import { SimpleFossilTask } from '../types';

/**
 * The `FossilError` is thrown when the underlying `git` process throws a
 * fatal exception (eg an `ENOENT` exception when attempting to use a
 * non-writable directory as the root for your repo), and acts as the
 * base class for more specific errors thrown by the parsing of the
 * git response or errors in the configuration of the task about to
 * be run.
 *
 * When an exception is thrown, pending tasks in the same instance will
 * not be executed. The recommended way to run a series of tasks that
 * can independently fail without needing to prevent future tasks from
 * running is to catch them individually:
 *
 * ```typescript
 import { fossilP, SimpleFossil, FossilError, PullResult } from 'simple-fossil';

 function catchTask (e: FossilError) {
   return e.
 }

 const git = fossilP(repoWorkingDir);
 const pulled: PullResult | FossilError = await fossil.pull().catch(catchTask);
 const pushed: string | FossilError = await fossil.pushTags().catch(catchTask);
 ```
 */
export class FossilError extends Error {

   constructor (
      public task?: SimpleFossilTask<any>,
      message?: string,
   ) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
   }

}
