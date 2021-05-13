import simpleFossil, {
   CleanOptions,
   CleanSummary,
   FossilResponseError,
   MergeSummary,
   SimpleFossil,
   TaskConfigurationError
} from 'simple-fossil';
import {
   createSingleConflict,
   createTestContext,
   setUpConflicted,
   setUpInit,
   SimpleFossilTestContext
} from '../__fixtures__';

describe('TS consume root export', () => {

   let context: SimpleFossilTestContext;

   beforeEach(async () => context = await createTestContext());
   beforeEach(() => setUpInit(context));

   it('log types', () => {
      expect(simpleFossil().log<{ message: string }>({n: 10, format: {message: 'something'}})).not.toBeFalsy();
   });

   it('imports', () => {
      expect(typeof simpleFossil).toBe('function');
      expect(CleanOptions).toEqual(expect.objectContaining({
         'FORCE': 'f',
      }));
   });

   it('finds types, enums and errors', async () => {
      await setUpInit(context);
      const fossil: SimpleFossil = simpleFossil(context.root);
      await context.file('file.txt', 'content');

      const error: TaskConfigurationError | CleanSummary = await fossil.clean(CleanOptions.DRY_RUN, ['--interactive'])
         .catch((e: TaskConfigurationError) => e);
      expect(error).toBeInstanceOf(Error);

      const clean: CleanSummary = await fossil.clean(CleanOptions.FORCE);
      expect(clean).toEqual(expect.objectContaining({
         dryRun: false,
         files: ['file.txt'],
      }));
   });

   it('handles exceptions', async () => {
      const fossil: SimpleFossil = simpleFossil(context.root);

      await setUpConflicted(context);
      const branchName = await createSingleConflict(context);
      let wasError = false;

      const mergeSummary: MergeSummary = await fossil.merge([branchName])
         .catch((e: Error | FossilResponseError<MergeSummary>) => {
            if (e instanceof FossilResponseError) {
               wasError = true;
               return e.fossil;
            }

            throw e;
         });

      expect(wasError).toBe(true);
      expect(mergeSummary.conflicts).toHaveLength(1);
      expect(String(mergeSummary)).toBe('CONFLICTS: aaa.txt:content');
   })

});
