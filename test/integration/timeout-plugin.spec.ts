import { promiseError } from '@kwsites/promise-result';
import { assertFossilError, createTestContext, newSimpleFossil, SimpleFossilTestContext } from '../__fixtures__';

import { FossilPluginError } from '../..';

describe('timeout', () => {

   let context: SimpleFossilTestContext;

   beforeEach(async () => context = await createTestContext());

   it('kills processes after a timeout', async () => {
      const upstream = await newSimpleFossil(__dirname).revparse('--git-dir');

      const fossil = newSimpleFossil({
         baseDir: context.root,
         timeout: {
            block: 1,
         }
      });

      const threw = await promiseError(fossil.raw('clone', upstream, '.'));
      assertFossilError(threw, 'block timeout reached', FossilPluginError);
   });

})
