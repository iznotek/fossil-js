import { SimpleFossilOptions, SimpleFossilTask } from '../types';
import { FossilError } from './fossil-error';

export class FossilPluginError extends FossilError {

   constructor (
      public task?: SimpleFossilTask<any>,
      public readonly plugin?: keyof SimpleFossilOptions,
      message?: string,
   ) {
      super(task, message);
      Object.setPrototypeOf(this, new.target.prototype);
   }

}
