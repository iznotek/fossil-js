import { createTestContext, newSimpleFossil, setUpInit, SimpleFossilTestContext } from '../__fixtures__';

describe('remote', () => {
   let context: SimpleFossilTestContext;
   let REMOTE_URL_ROOT = 'https://github.com/steveukx';
   let REMOTE_URL = `${REMOTE_URL_ROOT}/git-js.git`;

   beforeEach(async () => context = await createTestContext());
   beforeEach(async () => {
      await setUpInit(context);
   });

   it('adds and removes named remotes', async () => {
      const fossil = newSimpleFossil(context.root).addRemote('remote-name', REMOTE_URL);

      expect(await fossil.getRemotes(true)).toEqual([
         {name: 'remote-name', refs: {fetch: REMOTE_URL, push: REMOTE_URL}},
      ]);

      await fossil.removeRemote('remote-name');
      expect(await fossil.getRemotes(true)).toEqual([]);
   });

   it('allows setting the remote url', async () => {
      const fossil = newSimpleFossil(context.root);

      let repoName = 'origin';
      let initialRemoteRepo = `${REMOTE_URL_ROOT}/initial.git`;
      let updatedRemoteRepo = `${REMOTE_URL_ROOT}/updated.git`;

      await fossil.addRemote(repoName, initialRemoteRepo);
      expect(await fossil.getRemotes(true)).toEqual([
         {name: repoName, refs: {fetch: initialRemoteRepo, push: initialRemoteRepo}},
      ]);

      await fossil.remote(['set-url', repoName, updatedRemoteRepo]);
      expect(await fossil.getRemotes(true)).toEqual([
         {name: repoName, refs: {fetch: updatedRemoteRepo, push: updatedRemoteRepo}},
      ]);

   });

})
