import { FossilError } from './fossil-error';
import { SimpleFossilOptions } from '../types';

/**
 * The `FossilConstructError` is thrown when an error occurs in the constructor
 * of the `simple-fossil` instance itself. Most commonly as a result of using
 * a `baseDir` option that points to a folder that either does not exist,
 * or cannot be read by the user the node script is running as.
 *
 * Check the `.message` property for more detail including the properties
 * passed to the constructor.
 */
export class FossilConstructError extends FossilError {

   constructor (
      public readonly config: SimpleFossilOptions,
      message: string,
   ) {
      super(undefined, message);
   }

}
