import { parseGetRemotes } from '../responses/GetRemoteSummary';
import { StringTask } from '../types';
import { straightThroughStringTask } from './task';

export function addRemoteTask(remoteName: string, remoteRepo: string, customArgs: string[] = []): StringTask<string> {
   return straightThroughStringTask(['remote', 'add', ...customArgs, remoteName, remoteRepo]);
}

export function getRemotesTask(): StringTask<any> {
   const commands = ['remote', 'list'];

   return {
      commands,
      format: 'utf-8',
      parser: parseGetRemotes,
   };
}

export function remoteTask(customArgs: string[] = []): StringTask<string> {
   const commands = [...customArgs];
   if (commands[0] !== 'remote') {
      commands.unshift('remote');
   }

   return straightThroughStringTask(commands);
}

export function deleteRemoteTask(remoteName: string) {
   return straightThroughStringTask(['remote', 'delete', remoteName]);
}
