import { FossilError } from '../errors/fossil-error';
import { FossilExecutorResult, SimpleFossilPluginConfig } from '../types';
import { SimpleFossilPlugin } from './simple-fossil-plugin';

type TaskResult = Omit<FossilExecutorResult, 'rejection'>;

function isTaskError (result: TaskResult) {
   return !!(result.exitCode && result.stdErr.length);
}

function getErrorMessage (result: TaskResult) {
   return Buffer.concat([...result.stdOut, ...result.stdErr]);
}

export function errorDetectionHandler (overwrite = false, isError = isTaskError, errorMessage: (result: TaskResult) => Buffer | Error = getErrorMessage) {

   return (error: Buffer | Error | undefined, result: TaskResult) => {
      if ((!overwrite && error) || !isError(result)) {
         return error;
      }

      return errorMessage(result);
   };
}

export function errorDetectionPlugin(config: SimpleFossilPluginConfig['errors']): SimpleFossilPlugin<'task.error'> {

   return {
      type: 'task.error',
      action(data, context) {
         const error = config(data.error, {
            stdErr: context.stdErr,
            stdOut: context.stdOut,
            exitCode: context.exitCode
         });

         if (Buffer.isBuffer(error)) {
            return {error: new FossilError(undefined, error.toString('utf-8'))};
         }

         return {
            error
         };
      },
   };

}
