import { StringTask } from '../types';

/**
 * Task used by `fossil.tags`
 */
export function tagListTask (customArgs: string[] = []): StringTask<string> {
   return {
      format: 'utf-8',
      commands: ['tag', 'list', ...customArgs],
      parser (text: string) {
         return text;
      },
   }
}

/**
 * Task used by `fossil.addTag`
 */
export function addTagTask (name: string, checkIn: string): StringTask<{name: string, checkIn: string}> {
   return {
      format: 'utf-8',
      commands: ['tag', 'add', name, checkIn],
      parser () {
         return {name, checkIn};
      }
   }
}

/**
 * Task used by `fossil.addTag`
 */
export function addAnnotatedTagTask (name: string, checkIn: string, tagMessage: string): StringTask<{name: string, checkIn: string, tagMessage: string}> {
   return {
      format: 'utf-8',
      commands: ['tag', 'add', name, checkIn, tagMessage],
      parser () {
         return {name, checkIn, tagMessage};
      }
   }
}
