import { assertExecutedCommands, closeWithSuccess, newSimpleFossil } from './__fixtures__';
import { SimpleFossil } from '../../typings';

describe('stash', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it('stash working directory', async () => {
      const queue = fossil.stash(callback);
      await closeWithSuccess();

      assertExecutedCommands('stash');
      expect(callback).toHaveBeenCalledWith(null, await queue);
   });

   it('stash pop', async () => {
      const queue = fossil.stash(['pop'], callback);
      await closeWithSuccess();

      assertExecutedCommands('stash', 'pop');
      expect(callback).toHaveBeenCalledWith(null, await queue);
   });

   it('stash with options no handler', async () => {
      fossil.stash(["branch", "some-branch"]);
      await closeWithSuccess();

      assertExecutedCommands('stash', 'branch', 'some-branch');
   });

   it('stash with options object no handler', async () => {
      fossil.stash({'--foo': null});
      await closeWithSuccess();

      assertExecutedCommands('stash', '--foo');
   });
});
