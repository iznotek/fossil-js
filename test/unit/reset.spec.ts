import { assertExecutedCommands, closeWithSuccess, newSimpleFossil } from './__fixtures__';
import { SimpleFossil } from '../../typings';
import { ResetMode } from '../../src/lib/tasks/reset';

describe('reset', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it.each<[ResetMode, string]>(
      ['hard', 'soft', 'merge', 'mixed', 'keep'].map(mode => [mode as ResetMode, `--${ mode }`])
   )('%s mode', async (mode, command) => {
      await assertNonErrorReset(fossil.reset(mode), [command]);
   });

   it('defaults to soft mode when supplying bad values', async () => {
      await assertNonErrorReset(fossil.reset('unknown' as any), ['--soft']);
   });

   it('reset hard to commit as options array', async () => {
      await assertNonErrorReset(fossil.reset(['commit-ish', '--hard']), ['commit-ish', '--hard']);
   });

   it('reset keep to commit as options object', async () => {
      await assertNonErrorReset(fossil.reset({'--keep': null, 'commit-ish': null}), ['--keep', 'commit-ish']);
   });

   it('reset hard to commit as mode with options array', async () => {
      await assertNonErrorReset(fossil.reset('hard' as ResetMode, ['commit-ish']), ['--hard', 'commit-ish']);
   });

   it('reset keep to commit as mode with options object', async () => {
      await assertNonErrorReset(fossil.reset('keep' as ResetMode, {'commit-ish': null}), ['--keep', 'commit-ish']);
   });

   it('resets a single file as options array', async () => {
      await assertNonErrorReset(fossil.reset(['--', 'path/to-file.txt']), ['--', 'path/to-file.txt']);
   });

   it('resets a single file as options object', async () => {
      await assertNonErrorReset(fossil.reset({'--': null, 'path/to-file.txt': null}), ['--', 'path/to-file.txt']);
   });

   it('resets a single file with mode and options array', async () => {
      const resetOptions = ['--', 'path/to-file.txt'];

      await assertNonErrorReset(fossil.reset('hard' as ResetMode, resetOptions), ['--hard', ...resetOptions]);
   });

   it('with callback handler', async () => {
      await assertNonErrorReset(
         fossil.reset(ResetMode.MIXED, callback),
         ['--mixed']
      );
   });

   it('with no arguments', async () => {
      await assertNonErrorReset(fossil.reset(), ['--soft']);
   });

   async function assertNonErrorReset (task: Promise<string>, commands: string[]) {
      closeWithSuccess('success');

      expect(await task).toBe('success');
      assertExecutedCommands('reset', ...commands);
   }

})

