import { InitResult } from '../../../typings';
import { parseInit } from '../responses/InitSummary';
import { OptionFlags, Options, StringTask } from '../types';

export type InitOptions = Options &
   OptionFlags<
      '--sha1'
      > &
   OptionFlags<
      '--template' | 
      '--admin-user' | 
      '-A' | 
      '--date-override', string>

export function initTask(path: string, customArgs: string[]): StringTask<InitResult> {
   const commands = ['init', ...customArgs];
   if (path) {
      commands.splice(1, 0, path);
   }

   return {
      commands,
      format: 'utf-8',
      parser(text: string): InitResult {
         return parseInit(path, text);
      }
   }
}
