import { DefaultLogFields } from '../src/lib/tasks/log';

export interface BranchSummary {
   current: string;
   all: string[];
}

/**
 * Represents the successful deletion of a single branch
 */
export interface BranchSingleDeleteSuccess {
   branch: string;
   hash: string;
   success: true;
}

/**
 * Represents the failure to delete a single branch
 */
export interface BranchSingleDeleteFailure {
   branch: string;
   hash: null;
   success: false;
}

export type BranchSingleDeleteResult = BranchSingleDeleteFailure | BranchSingleDeleteSuccess;

export interface CleanSummary {
   readonly dryRun: boolean;
   paths: string[];
   files: string[];
   folders: string[];
}

export interface CommitResult {
   revision: string
}

/**
 * Represents the current fossil configuration, as defined by the output from `fossil log`
 */
export interface ConfigListSummary {

   /**
    * All configuration settings, where local/user settings override user/global settings
    * the overridden value will appear in this object.
    */
   readonly all: ConfigValues;

   /**
    * The file paths configuration was read from
    */
   files: string[];

   /**
    * The `ConfigValues` for each of the `files`, use this object to determine
    * local repo, user and global settings.
    */
   values: { [fileName: string]: ConfigValues };
}

/**
 * Represents the map of configuration settings
 */
export interface ConfigValues {
   [key: string]: string | string[];
}

export interface DiffResultTextFile {
   file: string;
   changes: number;
   insertions: number;
   deletions: number;
   binary: boolean;
}

export interface DiffResultBinaryFile {
   file: string;
   before: number;
   after: number;
   binary: boolean;
}

export interface DiffResult {
   /** The total number of files changed as reported in the summary line */
   changed: number;

   /** When present in the diff, lists the details of each file changed */
   files: Array<DiffResultTextFile | DiffResultBinaryFile>;

   /** The number of files changed with insertions */
   insertions: number;

   /** The number of files changed with deletions */
   deletions: number;
}

export interface FetchResult {
   raw: string;
   remote: string | null;
   branches: {
      name: string;
      tracking: string;
   }[];
   tags: {
      name: string;
      tracking: string;
   }[];
}

/**
 * The `InitResult` is returned when (re)initialising a fossil repo.
 */
export interface InitResult {

   /**
    * The fossil repository path  
    */
   readonly repository: string;

   /**
    * The fossil projectId  
    */
   readonly projectId: string;

   /**
    * The fossil projectId  
    */
   readonly serverId: string;

   /**
    * The fossil admin user  
    */
   readonly admin: string;

   /**
    * The fossil admin password  
    */
   readonly password: string;
}

/**
 * The `InitResult` is returned when (re)initialising a fossil repo.
 */
 export interface OpenResult {

   /**
    * The fossil project-name  
    */
   readonly projectName: string;

   /**
    * The fossil repository path  
    */
   readonly repository: string;

   /**
    * The fossil local-root  
    */
   readonly localRoot: string;

   /**
    * The fossil config-db
    */
   readonly configDb: string;

   /**
    * The fossil project-code
    */
   readonly projectCode: string;

   /**
    * The fossil project-code
    */
   readonly checkout: string;

   /**
    * The fossil tags array
    */
   readonly tags: string;

   /**
    * The fossil comment
    */
   readonly comment: string;

   /**
    * The fossil comment
    */
   readonly checkIns: number;
}

/**
 * A parsed response summary for calls to `git mv`
 */
export interface MoveResult {
   /**
    * Array of files moved
    */
   moves: Array<{from: string, to: string}>;
}

export interface PullDetailFileChanges {
   [fileName: string]: number;
}

export interface PullDetailSummary {
   changes: number;
   insertions: number;
   deletions: number;
}

export interface PullDetail {
   /** Array of all files that are referenced in the pull */
   files: string[];

   /** Map of file names to the number of insertions in that file */
   insertions: PullDetailFileChanges;

   /** Map of file names to the number of deletions in that file */
   deletions: PullDetailFileChanges;

   summary: PullDetailSummary;

   /** Array of file names that have been created */
   created: string[];

   /** Array of file names that have been deleted */
   deleted: string[];
}

export interface PullResult extends PullDetail, RemoteMessageResult {
}

/**
 * Represents file name changes in a StatusResult
 */
export interface StatusResultRenamed {
   from: string;
   to: string;
}

export interface FileStatusResult {

   /** Original location of the file, when the file has been moved */
   from?: string

   /** Path of the file */
   path: string;

   /** First digit of the status code of the file, e.g. 'M' = modified.
    Represents the status of the index if no merge conflicts, otherwise represents
    status of one side of the merge. */
   index: string;

   /** Second digit of the status code of the file. Represents status of the working directory
    if no merge conflicts, otherwise represents status of other side of a merge. */
   working_dir: string;
}

/**
 * The StatusResult is returned for calls to `fossil.status()`, represents the state of the
 * working directory.
 */
export interface StatusResult {
   extra: string[];
   added: string[];
   deleted: string[];
   edited: string[];
   // renamed: StatusResultRenamed[];
   renamed: string[];
   merged: string[];
   conflicted: string[];

   staged: string[];
   files: FileStatusResult[];

   current: string | null;

   /**
    * Gets whether this represents a clean working branch.
    */
   isClean(): boolean;
}

/**
 * Response retrieved when using the `fossil.tags` method
 */
export interface TagResult {
   /**
    * All tag names
    */
   all: string[];

   /**
    * The semver latest tag name or `undefined` when no tags are named in the response
    */
   latest: string | undefined;
}

/**
 * The ListLogLine represents a single entry in the `fossil.log`, the properties on the object
 * are mixed in depending on the names used in the format (see `DefaultLogFields`), but some
 * properties are dependent on the command used.
 */
export interface ListLogLine {
   /**
    * When using a `--stat=4096` or `--shortstat` options in the `fossil.log` or `fossil.stashList`,
    * each entry in the `ListLogSummary` will also have a `diff` property representing as much
    * detail as was given in the response.
    */
   diff?: DiffResult;
}

export interface LogResult<T = DefaultLogFields> {
   all: ReadonlyArray<T & ListLogLine>;
   total: number;
   latest: (T & ListLogLine) | null;
}

/**
 * Where the file was deleted, if there is a modify/delete conflict
 */
export interface MergeConflictDeletion {
   deleteRef: string;
}

/**
 * Represents a single file with conflicts in the MergeSummary
 */
export interface MergeConflict {

   /**
    * Type of conflict
    */
   reason: string;

   /**
    * Path to file
    */
   file: string | null;

   /**
    * Additional detail for the specific type of conflict
    */
   meta?: MergeConflictDeletion;
}

export type MergeResultStatus = 'success' | string;

export interface MergeDetail {
   conflicts: MergeConflict[];
   merges: string[];
   result: MergeResultStatus;
   readonly failed: boolean;
}

export type MergeResult = PullResult & MergeDetail;

/**
 *
 */
export interface PushResultPushedItem {
   local: string;
   remote: string;

   readonly deleted: boolean;
   readonly tag: boolean;
   readonly branch: boolean;
   readonly new: boolean;
   readonly alreadyUpdated: boolean;
}

export interface RemoteMessagesObjectEnumeration {
   enumerating: number,
   counting: number,
   compressing: number,
   total: {
      count: number,
      delta: number,
   },
   reused: {
      count: number,
      delta: number,
   },
   packReused: number,
}

export interface RemoteMessages {
   all: string[];
   objects?: RemoteMessagesObjectEnumeration;
}

export interface PushResultRemoteMessages extends RemoteMessages {
   pullRequestUrl?: string;
   vulnerabilities?: {
      count: number;
      summary: string;
      url: string;
   };
}

export interface RemoteMessageResult<T extends RemoteMessages = RemoteMessages> {
   remoteMessages: T;
}

export interface PushResultBranchUpdate {
   head: {
      local: string;
      remote: string;
   };
   hash: {
      from: string;
      to: string;
   };
}

export interface PushDetail {
   repo?: string;
   ref?: {
      local: string;
   };
   pushed: PushResultPushedItem[];
   branch?: {
      local: string;
      remote: string;
      remoteName: string;
   };
   update?: PushResultBranchUpdate;
}

export interface PushResult extends PushDetail, RemoteMessageResult<PushResultRemoteMessages> {
}

/**
 * @deprecated
 * For consistent naming, please use `CommitResult` instead of `CommitSummary`
 */
export type CommitSummary = CommitResult;

/**
 * @deprecated
 * For consistent naming, please use `MergeResult` instead of `MergeSummary`
 */
export type MergeSummary = MergeResult;

/**
 * @deprecated to aid consistent naming, please use `BranchSingleDeleteResult` instead of `BranchDeletionSummary`.
 */
export type BranchDeletionSummary = BranchSingleDeleteResult;

/**
 * @deprecated to aid consistent naming, please use `BranchMultiDeleteResult` instead of `BranchDeletionBatchSummary`.
 */
export type BranchDeletionBatchSummary = BranchMultiDeleteResult;

export type MoveSummary = MoveResult;

/**
 * @deprecated to aid consistent naming, please use `LogResult` instead of `ListLogSummary`.
 */
export type ListLogSummary<T = DefaultLogFields> = LogResult<T>;
