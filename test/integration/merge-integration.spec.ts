import { FossilResponseError, MergeResult, SimpleFossil } from '../../typings';
import { promiseError } from '@kwsites/promise-result';
import {
   assertFossilError,
   createSingleConflict,
   createTestContext,
   FIRST_BRANCH,
   like,
   newSimpleFossil,
   newSimpleFossilP,
   SECOND_BRANCH,
   setUpConflicted,
   setUpInit,
   SimpleFossilTestContext
} from '../__fixtures__';

describe('merge', () => {
   let context: SimpleFossilTestContext;

   beforeEach(async () => context = await createTestContext());
   beforeEach(async () => {
      await setUpInit(context);
      await context.files('aaa.txt', 'bbb.txt', 'ccc.other');
      await setUpConflicted(context)
   });

   async function singleFileConflict(simpleFossil: SimpleFossil) {
      const branchName = await createSingleConflict(context);
      const mergeError = await promiseError<FossilResponseError<MergeResult>>(simpleFossil.merge([branchName]));

      expect(mergeError?.fossil.conflicts).toEqual([{file: 'aaa.txt', reason: 'content'}]);
      assertFossilError(mergeError, 'CONFLICTS: aaa.txt:content');
   }

   it('single file conflict: git', async () => {
      await singleFileConflict(newSimpleFossil(context.root));
   });

   it('single file conflict: fossilP', async () => {
      await singleFileConflict(newSimpleFossilP(context.root));
   });

   it('multiple files conflicted', async () => {
      const fossil = newSimpleFossil(context.root);

      // second is ahead of master and has both file
      await fossil.checkout(SECOND_BRANCH);
      await context.file(`bbb.txt`, Array(19).join('bbb\n') + 'BBB\n');
      await fossil.add(`bbb.txt`);
      await fossil.commit('move second ahead of first');

      // switch to first and create conflicts with second
      await fossil.checkout(FIRST_BRANCH);
      await context.file(`aaa.txt`, 'Conflicting\nFile content');
      await context.file(`bbb.txt`, 'BBB\n' + Array(19).join('bbb\n'));
      await context.file(`ccc.txt`, 'Totally Conflicting');
      await fossil.add([`aaa.txt`, `bbb.txt`, `ccc.txt`]);
      await fossil.commit('move first ahead of second');

      // merging second will fail on `aaa.txt` and `ccc.txt` due to the same line changing
      // but `bbb.txt` will merge fine because they changed at opposing ends of the file
      const mergeError = await promiseError<FossilResponseError<MergeResult>>(fossil.merge([SECOND_BRANCH]));
      expect(mergeError?.fossil).toHaveProperty('failed', true);
      expect(mergeError?.fossil).toHaveProperty('conflicts', [
         {'reason': 'add/add', 'file': 'ccc.txt'},
         {
            'reason': 'content',
            'file': 'aaa.txt'
         }]);
      assertFossilError(mergeError, 'CONFLICTS: ccc.txt:add/add, aaa.txt:content');
   });

   it('multiple files updated and merged', async () => {
      const fossil = newSimpleFossil(context.root);

      await fossil.checkout(FIRST_BRANCH);
      expect(await fossil.merge([SECOND_BRANCH])).toEqual(like({failed: false}));
   });

});
