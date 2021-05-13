import { promiseError } from '@kwsites/promise-result';
import {
   assertFossilError,
   createTestContext,
   like,
   newSimpleFossil,
   newSimpleFossilP,
   SimpleFossilTestContext
} from '../__fixtures__';

import { FossilConstructError } from '../..';

describe('bad initial path', () => {

   let context: SimpleFossilTestContext;

   beforeEach(async () => context = await createTestContext());

   it('simple-fossil/promise', async () => {
      const baseDir = context.path('foo');
      const fossil = newSimpleFossilP(baseDir);

      const errorInstance = await promiseError(fossil.init());
      assertFossilError(errorInstance, `does not exist`, FossilConstructError);
      expect(errorInstance).toHaveProperty('config', like({
         baseDir,
      }));
   });

   it('simple-fossil', async () => {
      const baseDir = context.path('foo');

      let errorInstance: Error | undefined;
      try {
         newSimpleFossil(baseDir);
      } catch (e) {
         errorInstance = e;
         assertFossilError(errorInstance, `does not exist`, FossilConstructError);
         expect(errorInstance).toHaveProperty('config', like({
            baseDir,
         }));
      } finally {
         expect(errorInstance).not.toBeUndefined();
      }
   });

});
