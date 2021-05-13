import { FossilError } from './fossil-error';

/**
 * The `FossilResponseError` is the wrapper for a parsed response that is treated as
 * a fatal error, for example attempting a `merge` can leave the repo in a corrupted
 * state when there are conflicts so the task will reject rather than resolve.
 *
 * For example, catching the merge conflict exception:
 *
 * ```typescript
 import { fossilP, SimpleFossil, FossilResponseError, MergeSummary } from 'simple-fossil';

 const git = fossilP(repoRoot);
 const mergeOptions: string[] = ['--no-ff', 'other-branch'];
 const mergeSummary: MergeSummary = await fossil.merge(mergeOptions)
      .catch((e: FossilResponseError<MergeSummary>) => e.fossil);

 if (mergeSummary.failed) {
   // deal with the error
 }
 ```
 */
export class FossilResponseError<T = any> extends FossilError {

   constructor(
      /**
       * `.git` access the parsed response that is treated as being an error
       */
      public readonly fossil: T,
      message?: string,
   ) {
      super(undefined, message || String(fossil));
   }

}
