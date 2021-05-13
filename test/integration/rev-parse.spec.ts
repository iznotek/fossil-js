import { createTestContext, newSimpleFossil, setUpFilesAdded, setUpInit, SimpleFossilTestContext } from '../__fixtures__';

describe('rev-parse', () => {
   let context: SimpleFossilTestContext;

   beforeEach(async () => context = await createTestContext());
   beforeEach(async () => {
      await setUpInit(context);
      await setUpFilesAdded(context, ['file.txt']);
   });

   it('gets the commit hash for HEAD, responds with a trimmed string', async () => {
      const actual = await newSimpleFossil(context.root).revparse(['HEAD']);
      expect(actual).toBe(String(actual).trim());
   });

   it('gets the repo root', async () => {
      const actual = await newSimpleFossil(context.root).revparse(['--show-toplevel']);
      expect(actual).toBe(context.rootResolvedPath);
   });

});
