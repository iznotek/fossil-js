import * as errors from './typings/errors';
import * as types from './typings/types';
import * as resp from './typings/response';
import * as simpleFossil from './typings/simple-fossil';

declare const simplefossil: simplefossil.SimpleFossilExport;

declare namespace simplefossil {

   type SimpleFossilExport = ((basePath?: string) => simplefossil.SimpleFossil) & {
      CleanOptions: typeof types.CleanOptions
   };

   type SimpleFossil = simpleFossil.SimpleFossil;

   // errors
   type FossilError = errors.FossilError;
   type FossilConstructError = errors.FossilConstructError;
   type FossilResponseError<T> = errors.FossilResponseError<T>;
   type TaskConfigurationError = errors.TaskConfigurationError;

   // responses
   type BranchSummary = resp.BranchSummary
   type CleanSummary = resp.CleanSummary;
   type CleanMode = types.CleanMode;
   type DiffResult = resp.DiffResult;
   type FetchResult = resp.FetchResult;
   type CommitResult = resp.CommitResult;
   type MergeResult = resp.MergeResult;
   type PullResult = resp.PullResult;
   type StatusResult = resp.StatusResult;
   type TagResult = resp.TagResult;

   // types
   type outputHandler = types.outputHandler
   type LogOptions<T = types.DefaultLogFields> = types.LogOptions<T>;
   type Options = types.Options;

   // deprecated
   /** @deprecated use MergeResult */
   type MergeSummary = resp.MergeSummary;
   /** @deprecated use CommitResult */
   type CommitSummary = resp.CommitResult;
}

export = simplefossil;
