import { assertExecutedCommands, closeWithSuccess, newSimpleFossil } from './__fixtures__';
import { SimpleFossil } from '../../typings';
import { showAbbrevCommitSingleFile } from './__fixtures__/responses/show';

describe('show', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it('passes the response through without editing', async () => {
      const {stdOut} = showAbbrevCommitSingleFile();

      const queue = fossil.show(callback);
      await closeWithSuccess(stdOut);
      expect(await queue).toBe(stdOut);
   });

   it('allows the use of an array of options', async () => {
      fossil.show(['--abbrev-commit', 'foo', 'bar'], callback);
      await closeWithSuccess();
      assertExecutedCommands('show', '--abbrev-commit', 'foo', 'bar');
   });

   it('allows an options string', async () => {
      fossil.show('--abbrev-commit', callback);
      await closeWithSuccess();
      assertExecutedCommands('show', '--abbrev-commit');
   });

   it('allows an options object', async () => {
      fossil.show({'--foo': null}, callback);
      await closeWithSuccess();
      assertExecutedCommands('show', '--foo');
   });

});
