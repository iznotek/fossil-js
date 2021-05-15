import { straightThroughStringTask } from './task';
import { StringTask } from '../types';

export function syncTask(remote: string, customArgs: string[]): StringTask<string> {
   const commands = ['sync', ...customArgs];
   if (remote) {
      commands.push(remote);
   }

   return straightThroughStringTask(commands, true);
}
