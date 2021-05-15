import { OpenResult } from '../../../typings';
import { parseOpen } from '../responses/OpenSummary';
import { OptionFlags, Options, StringTask } from '../types';

export type CloneOptions = Options &
   OptionFlags<
      '--nested' |
      '--nocompress' |
      '--no-open' |
      '--once' |
      '--private' |
      '--save-http-password' |
      '--unversioned' |
      '-u' |
      '--verbose' |
      '-v'
      > &
   OptionFlags<'--workdir' | '--admin-user' | '-A' | '--httpauth' | '-B' | '--ssh-command' | '-c' | '--ssl-identity', string>

function hasWorkDirCommand(commands: string[]) {
   return commands.includes('--workdir');
}

export function cloneTask(repo: string | undefined, directory: string | undefined, customArgs: string[]): StringTask<OpenResult> {
   const commands = ['clone', ...customArgs];
   if (typeof repo === 'string') {
      commands.push(repo);
   }
   if (!hasWorkDirCommand(commands) && typeof directory === 'string') {
      commands.push('--workdir');
      commands.push(directory);
   }

   return {
      commands,
      format: 'utf-8',
      parser(text: string): OpenResult {
         return parseOpen(text);
      }
   }
}