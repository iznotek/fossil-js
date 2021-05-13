import { FossilError } from './errors/fossil-error';
import { FossilResponseError } from './errors/fossil-response-error';
import { SimpleFossilTask, SimpleFossilTaskCallback } from './types';
import { NOOP } from './utils';

export function taskCallback<R>(task: SimpleFossilTask<R>, response: Promise<R>, callback: SimpleFossilTaskCallback<R> = NOOP) {

   const onSuccess = (data: R) => {
      callback(null, data);
   };

   const onError = (err: FossilError | FossilResponseError) => {
      if (err?.task === task) {
         if (err instanceof FossilResponseError) {
            return callback(addDeprecationNoticeToError(err));
         }
         callback(err);
      }
   };

   response.then(onSuccess, onError);

}

function addDeprecationNoticeToError (err: FossilResponseError) {
   let log = (name: string) => {
      console.warn(`simple-fossil deprecation notice: accessing FossilResponseError.${name} should be FossilResponseError.fossil.${name}, this will no longer be available in version 3`);
      log = NOOP;
   };

   return Object.create(err, Object.getOwnPropertyNames(err.fossil).reduce(descriptorReducer, {}));

   function descriptorReducer(all: PropertyDescriptorMap, name: string): typeof all {
      if (name in err) {
         return all;
      }

      all[name] = {
         enumerable: false,
         configurable: false,
         get () {
            log(name);
            return err.fossil[name];
         },
      };

      return all;
   }
}
