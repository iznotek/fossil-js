import { BranchSummary } from '../../../typings';
import { BranchSummaryResult } from '../responses/BranchSummary';
import { LineParser, parseStringResponse } from '../utils';

const parsers: LineParser<BranchSummaryResult>[] = [
   new LineParser(/(\*\s)?(\S+)$/, (result, [current, name]) => {
      result.push(
         !!current,
         name,
      );
   })
];

export function parseBranchSummary (stdOut: string): BranchSummary {
   return parseStringResponse(new BranchSummaryResult(), parsers, stdOut);
}
