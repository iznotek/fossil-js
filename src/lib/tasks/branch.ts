import { BranchSingleDeleteResult, BranchSummary } from '../../../typings';
import { StringTask } from '../types';
import { parseBranchSummary } from '../parsers/parse-branch';

export function branchTask(customArgs: string[]): StringTask<BranchSummary | BranchSingleDeleteResult> {
   const commands = ['branch', 'list', '-t', ...customArgs];

   return {
      format: 'utf-8',
      commands,
      parser(stdOut) {
         return parseBranchSummary(stdOut);
      },
   }
}
