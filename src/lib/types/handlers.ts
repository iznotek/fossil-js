import { FossilError } from '../errors/fossil-error';

/**
 * The node-style callback to a task accepts either two arguments with the first as a null
 * and the second as the data, or just one argument which is an error.
 */
export interface SimpleFossilTaskCallback<T = string, E extends FossilError = FossilError> {
   (err: null, data: T): void;

   (err: E): void;
}

/**
 * The event data emitted to the progress handler whenever progress detail is received.
 */
export interface SimpleFossilProgressEvent {
   /** The underlying method called - push, pull etc */
   method: string;
   /** The type of progress being reported, note that any one task may emit many stages - for example `git clone` emits both `receiving` and `resolving` */
   stage: 'compressing' | 'counting' | 'receiving' | 'resolving' | 'unknown' | 'writing' | string;
   /** The percent progressed as a number 0 - 100 */
   progress: number;
   /** The number of items processed so far */
   processed: number;
   /** The total number of items to be processed */
   total: number;
}
