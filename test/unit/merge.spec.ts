import { promiseError } from '@kwsites/promise-result';
import {
   assertExecutedCommands,
   assertFossilResponseError,
   closeWithError,
   closeWithSuccess,
   like,
   mergeMadeByStrategy,
   newSimpleFossil,
   wait
} from './__fixtures__';
import { MergeResult, SimpleFossil, SimpleFossilTaskCallback } from 'typings';
import { MergeSummaryDetail } from '../../src/lib/responses/MergeSummary';
import { parseMergeResult } from '../../src/lib/parsers/parse-merge';

describe('merge', () => {

   describe('api', () => {

      let fossil: SimpleFossil;

      beforeEach(() => fossil = newSimpleFossil());

      it('merge', async () => {
         fossil.merge(['--no-ff', 'someOther-master']);
         await closeWithSuccess();

         assertExecutedCommands('merge', '--no-ff', 'someOther-master');
      });

      it('mergeFromTo', async () => {
         fossil.mergeFromTo('aaa', 'bbb', jest.fn());
         await closeWithSuccess();

         assertExecutedCommands('merge', 'aaa', 'bbb');
      });

      it('mergeFromToWithOptions', async () => {
         fossil.mergeFromTo('aaa', 'bbb', ['x', 'y'], jest.fn());
         await closeWithSuccess();

         assertExecutedCommands('merge', 'aaa', 'bbb', 'x', 'y');
      });

      it('mergeFromToWithBadOptions', async () => {
         (fossil as any).mergeFromTo('aaa', 'bbb', 'x', jest.fn());
         await closeWithSuccess();

         assertExecutedCommands('merge', 'aaa', 'bbb');
      });

      it('merge with fatal error', async () => {
         const message = 'Some fatal error';
         const later = jest.fn();
         fossil.mergeFromTo('aaa', 'bbb', 'x' as any, later);


         await closeWithError(message, 128);
         await wait();
         expect(later).toHaveBeenCalledWith(like({message}));

      });

      it('merge with conflicts treated as an error', async () => {
         const queue = fossil.mergeFromTo('aaa', 'bbb');
         closeWithSuccess(`
Auto-merging readme.md
CONFLICT (content): Merge conflict in readme.md
Automatic merge failed; fix conflicts and then commit the result.
`);
         const error = await promiseError(queue);
         assertFossilResponseError(error, MergeSummaryDetail, like({failed: true}))
      });

      it('responds with a MergeResult', async () => {
         const mock: SimpleFossilTaskCallback<MergeResult> = jest.fn();
         const queue = fossil.mergeFromTo('alpha', 'beta', mock);
         await closeWithSuccess(mergeMadeByStrategy('recursive'));

         const result: MergeResult = await queue;
         expect(mock).toHaveBeenCalledWith(null, result)
      });
   });

   describe('parser', () => {

      let mergeSummary: MergeResult;

      it('successful merge with some files updated', () => {
         givenTheResponse(`
Updating 5826641..52c5cc6
Fast-forward
 aaa.aaa | 2 +-
 ccc.ccc | 1 +
 50 files changed, 20 insertions(+), 1 deletion(-)
 create mode 100644 ccc.ccc
`);
         expect(mergeSummary).toEqual(
            like({
               failed: false,
               conflicts: [],
               merges: [],
               summary: {
                  changes: 50,
                  insertions: 20,
                  deletions: 1,
               }
            })
         );
      });

      it('multiple merges with some conflicts and some success', () => {
         givenTheResponse(`
Auto-merging ccc.ccc
CONFLICT (add/add): Merge conflict in ccc.ccc
Auto-merging bbb.bbb
Auto-merging aaa.aaa
CONFLICT (content): Merge conflict in aaa.aaa
Automatic merge failed; fix conflicts and then commit the result.
`);

         expect(mergeSummary).toEqual(
            like({
               failed: true,
               conflicts: [
                  {reason: 'add/add', file: 'ccc.ccc'},
                  {reason: 'content', file: 'aaa.aaa'},
               ],
               merges: [
                  'ccc.ccc',
                  'bbb.bbb',
                  'aaa.aaa'
               ],
            })
         );
      });

      it('names conflicts when they exist', () => {
         givenTheResponse(`
Auto-merging readme.md
CONFLICT (content): Merge conflict in readme.md
Automatic merge failed; fix conflicts and then commit the result.
`);

         expect(mergeSummary.failed).toBe(true);
         expect(mergeSummary.conflicts).toEqual([
            {reason: 'content', file: 'readme.md'}
         ]);
      });

      it('names modify/delete conflicts when deleted by them', () => {
         givenTheResponse(`
Auto-merging readme.md
CONFLICT (modify/delete): readme.md deleted in origin/master and modified in HEAD. Version HEAD of readme.md left in tree.
Automatic merge failed; fix conflicts and then commit the result.
`);
         expect(mergeSummary.failed).toBe(true);
         expect(mergeSummary.conflicts).toEqual([
            {
               reason: 'modify/delete',
               file: 'readme.md',
               meta: {deleteRef: 'origin/master'}
            }
         ]);
      });

      it('names modify/delete conflicts when deleted by us', () => {
         givenTheResponse(`
Auto-merging readme.md
CONFLICT (modify/delete): readme.md deleted in HEAD and modified in origin/master. Version origin/master of readme.md left in tree.
Automatic merge failed; fix conflicts and then commit the result.
`);
         expect(mergeSummary.failed).toBe(true);
         expect(mergeSummary.conflicts).toEqual([
            {
               reason: 'modify/delete',
               file: 'readme.md',
               meta: {deleteRef: 'HEAD'}
            }
         ]);
      });

      function givenTheResponse(stdOut: string, stdErr = '') {
         return mergeSummary = parseMergeResult(stdOut, stdErr);
      }

   });

})
