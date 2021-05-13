import { createTestContext, newSimpleFossil, setUpInit, SimpleFossilTestContext } from '../__fixtures__';
import { SimpleFossil } from '../../typings';
import { promiseError } from '@kwsites/promise-result';

describe('checkout', () => {

   let context: SimpleFossilTestContext;
   let fossil: SimpleFossil;

   beforeEach(async () => context = await createTestContext());
   beforeEach(async () => {
      await setUpInit(context);
      await context.files('aaa.txt', 'bbb.txt', 'ccc.other');
      fossil = newSimpleFossil(context.root);
   });

   it('checkoutLocalBranch', async () => {
      const {current: initialBranch} = await fossil.status();

      expect(await promiseError(fossil.checkoutLocalBranch('my-new-branch'))).toBeUndefined();

      const {current: finalBranch} = await fossil.status();
      expect(finalBranch).toBe('my-new-branch');
      expect(finalBranch).not.toBe(initialBranch);
   });


});
