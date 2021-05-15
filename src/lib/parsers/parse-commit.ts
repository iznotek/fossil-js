import { CommitResult } from '../../../typings';
import { LineParser, parseStringResponse } from '../utils';

const parsers: LineParser<CommitResult>[] = [
   new LineParser(/\s*New_Version:\s(.+)/i, (result, [revision]) => {
      result.revision = revision
   }),
];

export function parseCommitResult(stdOut: string): CommitResult {
   const result: CommitResult = {
      revision: ''
   };
   return parseStringResponse(result, parsers, stdOut);
}
