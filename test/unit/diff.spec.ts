import {
   assertExecutedCommands, closeWithSuccess,
   diffSummaryMultiFile,
   diffSummarySingleFile,
   like,
   newSimpleFossil,
   newSimpleFossilP, wait
} from './__fixtures__';
import { SimpleFossil } from '../../typings';
import { parseDiffResult } from '../../src/lib/parsers/parse-diff-summary';

describe('diff', () => {

   let fossil: SimpleFossil;

   describe('parsing', () => {

      it('bin summary', () => {
         const summary = parseDiffResult(`
 my-package.tar.gz | Bin 3163 -> 3244 bytes
 1 file changed, 0 insertions(+), 0 deletions(-)
 `);
         expect(summary).toEqual(like({
            insertions: 0,
            deletions: 0,
            files: [{
               file: 'my-package.tar.gz',
               before: 3163,
               after: 3244,
               binary: true
            }]
         }));
      });

      it('single text file with changes', () => {
         const actual = parseDiffResult(
            diffSummarySingleFile(1, 2, 'package.json').stdOut
         );
         expect(actual).toEqual(like({
            changed: 1,
            insertions: 1,
            deletions: 2,
            files: [
               {
                  file: 'package.json',
                  changes: 3,
                  insertions: 1,
                  deletions: 2,
                  binary: false,
               }
            ]
         }));

      });

      it('multiple text files', () => {
         const actual = parseDiffResult(diffSummaryMultiFile(
            {fileName: 'src/fossil.js', insertions: 2},
            {fileName: 'test/testCommands.js', deletions: 2, insertions: 1},
         ).stdOut);

         expect(actual).toEqual(like({
            changed: 2,
            insertions: 3,
            deletions: 2,
            files: [
               {
                  file: 'src/fossil.js',
                  changes: 2,
                  insertions: 2,
                  deletions: 0,
                  binary: false,
               },
               {
                  file: 'test/testCommands.js',
                  changes: 3,
                  insertions: 1,
                  deletions: 2,
                  binary: false,
               }
            ]
         }))
      });

      it('recognises binary files', () => {
         const actual = parseDiffResult(`
            some/image.png     |       Bin 0 -> 9806 bytes
            1 file changed, 1 insertion(+)
         `);

         expect(actual).toEqual(like({
            files: [
               {
                  file: 'some/image.png',
                  before: 0,
                  after: 9806,
                  binary: true,
               }
            ]
         }));
      });

      it('recognises files changed in modified time only', () => {
         const actual = parseDiffResult(`
      abc | 0
      def | 1 +
      2 files changed, 1 insertion(+)
   `);

         expect(actual).toEqual(like({
            files: [
               {file: 'abc', changes: 0, insertions: 0, deletions: 0, binary: false},
               {file: 'def', changes: 1, insertions: 1, deletions: 0, binary: false},
            ]
         }));
      });

      it('picks number of files changed from summary line', () => {
         expect(parseDiffResult('1 file changed, 1 insertion(+)')).toHaveProperty('changed', 1);
         expect(parseDiffResult('2 files changed, 1 insertion(+), 1 deletion(+)')).toHaveProperty('changed', 2);
      });

   });

   describe('usage:promise', () => {

      beforeEach(() => fossil = newSimpleFossilP());

      it('fetches a specific diff', async () => {
         const diff = fossil.diff(['HEAD', 'FETCH_HEAD']);
         closeWithSuccess('-- diff data --');

         expect(await diff).toBe('-- diff data --');
         assertExecutedCommands('diff', 'HEAD', 'FETCH_HEAD')
      });

      it('fetches a specific diff summary', async () => {
         const diff = fossil.diffSummary(['HEAD', 'FETCH_HEAD']);
         closeWithSuccess(`
 b | 1 +
 1 file changed, 1 insertion(+)
`);

         expect((await diff)).toEqual(expect.objectContaining({
            insertions: 1,
            deletions: 0
         }));
         assertExecutedCommands('diff', '--stat=4096', 'HEAD', 'FETCH_HEAD')
      });

   });

   describe('usage', () => {

      beforeEach(() => fossil = newSimpleFossil());

      it('diff - no options', async () => {
         const queue = fossil.diff();
         await closeWithSuccess('~~ data ~~');
         expect(await queue).toBe('~~ data ~~');
         assertExecutedCommands('diff');
      });

      it('diff - options array', async () => {
         const queue = fossil.diff(['FETCH', 'FETCH_HEAD']);
         await closeWithSuccess('~~ data ~~');
         expect(await queue).toBe('~~ data ~~');
         assertExecutedCommands('diff', 'FETCH', 'FETCH_HEAD');
      });

      it('diff - options object', async () => {
         const queue = fossil.diff({a: null});
         await closeWithSuccess('~~ data ~~');
         expect(await queue).toBe('~~ data ~~');
         assertExecutedCommands('diff', 'a');
      });

      it('diff - options with callback', async () => {
         const later = jest.fn();
         fossil.diff({a: null}, later);
         closeWithSuccess('~~ data ~~');
         await wait();

         expect(later).toHaveBeenCalledWith(null, '~~ data ~~');
      });

      it('trailing function handler receives result', async () => {
         const later = jest.fn();
         const queue = fossil.diffSummary(later);
         await closeWithSuccess(diffSummarySingleFile().stdOut);

         expect(later).toHaveBeenCalledWith(null, await queue);
      });

      it('diffSummary - no options', async () => {
         const queue = fossil.diffSummary();
         await closeWithSuccess(diffSummarySingleFile(1, 2, 'package.json').stdOut);

         expect(await queue).toEqual(like({
            changed: 1,
            insertions: 1,
            deletions: 2,
            files: [
               {
                  file: 'package.json',
                  changes: 3,
                  insertions: 1,
                  deletions: 2,
                  binary: false,
               }
            ]
         }));
         assertExecutedCommands('diff', '--stat=4096');
      });

      it('diffSummary - with options', async () => {
         fossil.diffSummary(['opt-a', 'opt-b'], jest.fn());
         await closeWithSuccess();
         assertExecutedCommands('diff', '--stat=4096', 'opt-a', 'opt-b');
      });

      it('diffSummary - with options object', async () => {
         fossil.diffSummary({'HEAD': null, 'FETCH_HEAD': null}, jest.fn());
         await closeWithSuccess();
         assertExecutedCommands('diff', '--stat=4096', 'HEAD', 'FETCH_HEAD');
      });

      it('diffSummary - single option', async () => {
         fossil.diffSummary('opt-a' as any, jest.fn());
         await closeWithSuccess(diffSummarySingleFile().stdOut);
         assertExecutedCommands('diff', '--stat=4096', 'opt-a');
      });
   });

});
