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

export function openTask(path: string, workdir: string, customArgs: string[]): StringTask<OpenResult> {
   const commands = ['open', path, ...customArgs];
   if (!hasWorkDirCommand(commands)) {
      commands.push('--workdir')
      commands.push(workdir);
   }

   return {
      commands,
      format: 'utf-8',
      parser(text: string): OpenResult {
         return parseOpen(text);
      }
   }
}
