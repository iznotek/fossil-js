import { SimpleFossilOptions } from '../types';
import { asNumber, including } from '../utils';

import { SimpleFossilPlugin } from './simple-fossil-plugin';

export function progressMonitorPlugin(progress: Exclude<SimpleFossilOptions['progress'], void>) {
   const progressCommand = '--progress';
   const progressMethods = ['checkout', 'clone', 'fetch', 'pull', 'push'];

   const onProgress: SimpleFossilPlugin<'spawn.after'> = {
      type: 'spawn.after',
      action(_data, context) {
         if (!context.commands.includes(progressCommand)) {
            return;
         }

         context.spawned.stderr?.on('data', (chunk: Buffer) => {
            const message = /^([a-zA-Z ]+):\s*(\d+)% \((\d+)\/(\d+)\)/.exec(chunk.toString('utf8'));
            if (!message) {
               return;
            }

            progress({
               method: context.method,
               stage: progressEventStage(message[1]),
               progress: asNumber(message[2]),
               processed: asNumber(message[3]),
               total: asNumber(message[4]),
            });
         });
      }
   };

   const onArgs: SimpleFossilPlugin<'spawn.args'> = {
      type: 'spawn.args',
      action(args, context) {
         if (!progressMethods.includes(context.method)) {
            return args;
         }

         return including(args, progressCommand);
      }
   }

   return [onArgs, onProgress];
}

function progressEventStage (input: string) {
   return String(input.toLowerCase().split(' ', 1)) || 'unknown';
}
