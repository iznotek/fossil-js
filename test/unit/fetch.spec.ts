import { assertExecutedCommands, closeWithSuccess, like, newSimpleFossil } from './__fixtures__';
import { SimpleFossil } from "../../typings";

describe('push', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it('runs escaped fetch', async () => {
      const branchPrefix = 'some-name';
      const ref = `'refs/heads/${branchPrefix}*:refs/remotes/origin/${branchPrefix}*'`;
      fossil.fetch(`origin`, ref, { '--depth': '2' }, callback);
      await closeWithSuccess();
      assertExecutedCommands('fetch', '--depth=2', 'origin', ref);
   });

   it('git generates a fetch summary', async () => {
      const queue = fossil.fetch('foo', 'bar', ['--depth=2']);
      await closeWithSuccess(`
         From https://github.com/steveukx/git-js
          * [new branch]       master     -> origin/master
          * [new tag]          0.11.0     -> 0.11.0
      `);

      assertExecutedCommands('fetch', '--depth=2', 'foo', 'bar');
      expect(await queue).toEqual(like({
         branches: [{ name: 'master', tracking: 'origin/master' }],
         remote: 'https://github.com/steveukx/git-js',
         tags: [{ name: '0.11.0', tracking: '0.11.0' }],
      }));
   });

   it('git fetch with remote and branch', async () => {
      fossil.fetch('r', 'b', callback);
      await closeWithSuccess();
      assertExecutedCommands('fetch', 'r', 'b');
   });

   it('git fetch with no options', async () => {
      fossil.fetch(callback);
      await closeWithSuccess();
      assertExecutedCommands('fetch');
   });

   it('git fetch with options', async () => {
      fossil.fetch({'--all': null}, callback);
      await closeWithSuccess();
      assertExecutedCommands('fetch', '--all');
   });

   it('git fetch with array of options', async () => {
      fossil.fetch(['--all', '-v'], callback);
      await closeWithSuccess();
      assertExecutedCommands('fetch', '--all', '-v');
   });

});
