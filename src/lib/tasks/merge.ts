import { MergeResult } from '../../../typings';
import { FossilResponseError } from '../errors/fossil-response-error';
import { parseMergeResult } from '../parsers/parse-merge';
import { StringTask } from '../types';
import { configurationErrorTask, EmptyTask } from './task';

export function mergeTask(customArgs: string[]): EmptyTask | StringTask<MergeResult> {
   if (!customArgs.length) {
      return configurationErrorTask('Fossil.merge requires at least one option');
   }

   return {
      commands: ['merge', ...customArgs],
      format: 'utf-8',
      parser(stdOut, stdErr): MergeResult {
         const merge = parseMergeResult(stdOut, stdErr);
         if (merge.failed) {
            throw new FossilResponseError(merge);
         }

         return merge;
      }
   }
}
