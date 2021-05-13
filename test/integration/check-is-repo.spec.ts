import { assertFossilError, createTestContext, newSimpleFossil, SimpleFossilTestContext } from '../__fixtures__';

import { CheckRepoActions } from '../../src/lib/tasks/check-is-repo';

describe('check-is-repo', () => {

   let context: SimpleFossilTestContext;
   let roots: { [key: string]: string };

   beforeEach(async () => context = await createTestContext());
   beforeEach(async () => {
      roots = {
         realRoot: await context.dir('real-root'),
         realSubRoot: await context.dir('real-root', 'foo'),
         fakeRoot: await context.dir('fake-root'),
         bareRoot: await context.dir('bare-root'),
      };

      await newSimpleFossil(roots.realRoot).init();
      await newSimpleFossil(roots.bareRoot).init(true);
   });

   it('throws errors other than in-repo detection errors', async () => {
      const fossil = newSimpleFossil(roots.realRoot).customBinary('nonsense');
      const catcher = jest.fn(err => {
         assertFossilError(err, 'nonsense');
      });

      await fossil.checkIsRepo().catch(catcher);
      expect(catcher).toHaveBeenCalled();
   });

   it('in-tree detection passes for a real root', async () => {
      expect(await newSimpleFossil(roots.realRoot).checkIsRepo()).toBe(true);
      expect(await newSimpleFossil(roots.realRoot).checkIsRepo(CheckRepoActions.IN_TREE)).toBe(true);
   });

   it('in-tree detection passes for a child directory of a real root', async () => {
      expect(await newSimpleFossil(roots.realSubRoot).checkIsRepo()).toBe(true);
      expect(await newSimpleFossil(roots.realSubRoot).checkIsRepo(CheckRepoActions.IN_TREE)).toBe(true);
   });

   it('detects the root of a repo', async () => {
      expect(await newSimpleFossil(roots.realRoot).checkIsRepo(CheckRepoActions.IS_REPO_ROOT)).toBe(true);
      expect(await newSimpleFossil(roots.bareRoot).checkIsRepo(CheckRepoActions.IS_REPO_ROOT)).toBe(true);
      expect(await newSimpleFossil(roots.realSubRoot).checkIsRepo(CheckRepoActions.IS_REPO_ROOT)).toBe(false);
   });

   it('detects the bare status of a repo', async () => {
      expect(await newSimpleFossil(roots.fakeRoot).checkIsRepo(CheckRepoActions.BARE)).toBe(false);
      expect(await newSimpleFossil(roots.realRoot).checkIsRepo(CheckRepoActions.BARE)).toBe(false);
      expect(await newSimpleFossil(roots.bareRoot).checkIsRepo(CheckRepoActions.BARE)).toBe(true);
   });

   it('detects being outside of a working directory', async () => {
      expect(await newSimpleFossil(roots.fakeRoot).checkIsRepo()).toBe(false);
      expect(await newSimpleFossil(roots.fakeRoot).checkIsRepo(CheckRepoActions.BARE)).toBe(false);
      expect(await newSimpleFossil(roots.fakeRoot).checkIsRepo(CheckRepoActions.IS_REPO_ROOT)).toBe(false);
      expect(await newSimpleFossil(roots.fakeRoot).checkIsRepo(CheckRepoActions.IN_TREE)).toBe(false);
   });

});
