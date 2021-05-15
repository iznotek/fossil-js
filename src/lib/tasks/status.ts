import { StatusResult } from '../../../typings';
import { parseStatusSummary } from '../responses/StatusSummary';
import { StringTask } from '../types';

export function statusTask(customArgs: string[]): StringTask<StatusResult> {
   return {
      format: 'utf-8',
      commands: ['status', '--differ', ...customArgs],
      parser(text: string) {
         return parseStatusSummary(text);
      }
   }
}
