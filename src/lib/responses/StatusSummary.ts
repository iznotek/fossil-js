import { FileStatusResult, StatusResult } from '../../../typings';
import { append } from '../utils';
import { FileStatusSummary } from './FileStatusSummary';

/**
 * The StatusSummary is returned as a response to getting `git().status()`
 */
export class StatusSummary implements StatusResult {
   public extra: string[] = [];
   public added: string[] = [];
   public deleted: string[] = [];
   public edited: string[] = [];
   public renamed: string[] = [];
   public merged: string[] = [];
   public conflicted: string[] = [];
   // public renamed: StatusResultRenamed[] = [];

   /**
    * All files represented as an array of objects containing the `path` and status in `index` and
    * in the `working_dir`.
    */
   public files: FileStatusResult[] = [];
   public staged: string[] = [];

   /**
    * Name of the current branch
    */
   public current: string | null = null;

   /**
    * Gets whether this StatusSummary represents a clean working branch.
    */
   public isClean(): boolean {
      return !this.files.length;
   }
}

enum TagFileStatus {
   ADDED = 'ADDED',
   DELETED = 'DELETED',
   EDITED = 'EDITED',
   RENAMED = 'RENAMED',
   MERGE = 'MERGE',
   CONFLICT = 'CONFLICT',
   EXTRA = 'EXTRA',
   NONE = ' ',
}

// function renamedFile(line: string) {
//    const detail = /^(.+) -> (.+)$/.exec(line);

//    if (!detail) {
//       return {
//          from: line, to: line
//       };
//    }

//    return {
//       from: String(detail[1]),
//       to: String(detail[2]),
//    };
// }

function parser(tag: TagFileStatus, handler: (result: StatusSummary, file: string) => void): [string, (result: StatusSummary, file: string) => unknown] {
   return [`${tag}`, handler];
}

const parsers: Map<string, (result: StatusSummary, file: string) => unknown> = new Map([
   parser(TagFileStatus.ADDED, (result, file) => append(result.added, file)),
   parser(TagFileStatus.DELETED, (result, file) => append(result.deleted, file)),
   parser(TagFileStatus.EDITED, (result, file) => append(result.edited, file)),
   parser(TagFileStatus.RENAMED, (result, file) => append(result.renamed, file)),
   parser(TagFileStatus.MERGE, (result, file) => append(result.merged, file)),
   parser(TagFileStatus.CONFLICT, (result, file) => append(result.conflicted, file)),
   parser(TagFileStatus.EXTRA, (result, file) => append(result.extra, file)),
]);

export const parseStatusSummary = function (text: string): StatusResult {
   const lines = text.trim().split('\n');
   const status = new StatusSummary();

   for (let i = 0, l = lines.length; i < l; i++) {
      splitLine(status, lines[i]);
   }

   return status;
};

function splitLine(result: StatusResult, lineStr: string) {
   const trimmed = lineStr.trim();
   switch (' ') {
      case trimmed.charAt(2):
         return data(trimmed.charAt(0), trimmed.charAt(1), trimmed.substr(3));
      case trimmed.charAt(1):
         return data(TagFileStatus.NONE, trimmed.charAt(0), trimmed.substr(2));
      default:
         return;
   }

   function data(index: string, workingDir: string, path: string) {
      const raw = `${index}${workingDir}`;
      const handler = parsers.get(raw);

      if (handler) {
         handler(result, path);
      }
         
      result.files.push(new FileStatusSummary(path, index, workingDir));
   }
}
