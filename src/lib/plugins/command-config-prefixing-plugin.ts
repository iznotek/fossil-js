import { prefixedArray } from '../utils';
import { SimpleFossilPlugin } from './simple-fossil-plugin';

export function commandConfigPrefixingPlugin(configuration: string[]): SimpleFossilPlugin<'spawn.args'> {
   const prefix = prefixedArray(configuration, '-c');

   return {
      type: 'spawn.args',
      action(data) {
         return [...prefix, ...data];
      },
   };
}
