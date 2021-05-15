import { OpenResult } from '../../../typings';
import { parseOpen } from '../responses/OpenSummary';
import { OptionFlags, Options, StringTask } from '../types';

export type OpenOptions = Options &
   OptionFlags<
      '--keep' |
      '--nested' |
      '--setmtime' |
      '--empty' |
      '-f' |
      '--force'
      > &
   OptionFlags<
      '--repodir' | 
      '--workdir'
      , string>

function hasWorkDirCommand(commands: string[]) {
   return commands.includes('--workdir');
}

export function openTask(repo: string | undefined, directory: string | undefined, customArgs: string[]): StringTask<OpenResult> {
   const commands = ['open', ...customArgs];
   if (typeof repo === 'string') {
      commands.push(repo);
   }
   if (!hasWorkDirCommand(commands) && typeof directory === 'string') {
      commands.push('--workdir')
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
