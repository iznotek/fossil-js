import { StringTask } from '../types';

export function addConfigTask(key: string, value: string, global = false): StringTask<string> {
   const commands: string[] = ['settings'];

   if (global) {
      commands.push('--global');
   }

   commands.push(key, value);

   return {
      commands,
      format: 'utf-8',
      parser(text: string): string {
         return text;
      }
   }
}

export function deleteConfigTask(key: string, global = false): StringTask<string> {
   const commands: string[] = ['unset'];

   if (global) {
      commands.push('--global');
   }

   commands.push(key);

   return {
      commands,
      format: 'utf-8',
      parser(text: string): string {
         return text;
      }
   }
}