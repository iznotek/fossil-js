import { promiseError } from '@kwsites/promise-result';
import {
   assertFossilError,
   createTestContext,
   newSimpleFossil,
   setUpFilesAdded,
   setUpInit,
   SimpleFossilTestContext
} from '../__fixtures__';

import { ResetMode } from '../../src/lib/tasks/reset';

describe('reset', () => {
   let context: SimpleFossilTestContext;

   beforeEach(async () => context = await createTestContext());
   beforeEach(async () => {
      await setUpInit(context);
      await setUpFilesAdded(context, ['alpha', 'beta', 'gamma'], 'alpha');
   });

   it('resets adding a single file', async () => {
      const fossil = newSimpleFossil(context.root);
      expect((await fossil.status()).not_added).toEqual(['beta', 'gamma']);

      await fossil.add('.');
      expect((await fossil.status()).not_added).toEqual([]);

      await fossil.reset(['--', 'beta'])
      expect((await fossil.status()).not_added).toEqual(['beta']);
   });

   it('throws when hard resetting a path', async () => {
      const fossil = newSimpleFossil(context.root);
      await fossil.add('.');
      const error = await promiseError(fossil.reset(ResetMode.HARD, ['--', 'beta']));

      assertFossilError(error, /hard reset/);
   });

});
