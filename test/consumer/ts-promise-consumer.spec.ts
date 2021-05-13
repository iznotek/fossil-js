import fossilP, { CleanOptions, CleanSummary, SimpleFossil, TaskConfigurationError } from 'simple-fossil/promise';
import { createTestContext, SimpleFossilTestContext } from '../__fixtures__';

describe('TS Promise Consumer', () => {

   let context: SimpleFossilTestContext;

   beforeEach(async () => context = await createTestContext());

   it('imports', () => {
      expect(typeof fossilP).toBe('function');
      expect(CleanOptions).toEqual(expect.objectContaining({
         'FORCE': 'f',
      }));
   });

   it('finds types, enums and errors', async () => {
      const fossil: SimpleFossil = fossilP(context.root);
      await fossil.init();
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

});
