import { promiseResult } from '@kwsites/promise-result';
import {
   assertFossilError,
   createTestContext,
   like,
   newSimpleFossil,
   setUpInit,
   SimpleFossilTestContext
} from '../__fixtures__';

describe('branches', () => {

   let context: SimpleFossilTestContext;

   beforeEach(async () => context = await createTestContext());
   beforeEach(async () => {
      const {file, fossil} = context;
      await setUpInit(context);
      await file('in-master');
      await fossil.raw('add', 'in-master');
      await fossil.raw('commit', '-m', 'master commit');
      await fossil.raw('branch', '-c', 'master', 'alpha');
      await fossil.raw('checkout', '-b', 'beta');
      await file('in-beta');
      await fossil.raw('add', 'in-beta');
      await fossil.raw('commit', '-m', 'beta commit');
      await fossil.raw('checkout', 'master');
   });

   it('reports the current branch detail', async () => {
      const fossil = newSimpleFossil(context.root);
      let actual = await fossil.branch();
      expect(actual).toEqual(like({
         all: ['alpha', 'beta', 'master'],
         current: 'master',
      }));
      expect(actual.branches.master.commit).toBe(actual.branches.alpha.commit);
      expect(actual.branches.master.commit).not.toBe(actual.branches.beta.commit);
   });

   it('rejects non-force deleting unmerged branches', async () => {
      const branchDeletion = await promiseResult(
         newSimpleFossil(context.root).deleteLocalBranch('beta')
      );

      assertFossilError(branchDeletion.result, /git branch -D/);
      expect(branchDeletion.success).toBe(false);
   });

   it(`force delete branch using the generic 'branch'`, async () => {
      const deletion = await newSimpleFossil(context.root).branch(['-D', 'beta']);
      expect(deletion).toEqual(like({
         success: true,
         branch: 'beta',
      }));
   });

   it('force deletes multiple branches', async () => {
      const deletion = await newSimpleFossil(context.root).deleteLocalBranches(['beta', 'alpha'], true);
      expect(deletion).toEqual(like({
         success: true,
      }));
      expect(deletion.branches.alpha).toEqual(like({success: true}));
      expect(deletion.branches.beta).toEqual(like({success: true}));
   });

   it('deletes multiple branches', async () => {
      const deletion = await newSimpleFossil(context.root).deleteLocalBranches(['alpha', 'beta']);

      expect(deletion).toEqual(like({
         success: false,
      }));
      expect(deletion.errors).toEqual([deletion.branches.beta]);
      expect(deletion.branches.alpha).toEqual(like({success: true}));
      expect(deletion.branches.beta).toEqual(like({success: false}));
   });

});
