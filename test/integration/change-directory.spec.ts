import { promiseError, promiseResult } from '@kwsites/promise-result';
import { assertFossilError, createTestContext, newSimpleFossil, SimpleFossilTestContext, wait } from '../__fixtures__';
import { SimpleFossil } from '../../typings';

describe('change-directory', () => {

   let context: SimpleFossilTestContext;
   let goodDir: string;
   let badDir: string;

   beforeEach(async () => context = await createTestContext());
   beforeEach(async () => {
      goodDir = await context.dir('good');
      badDir = await context.path('good', 'bad');
   });

   it('cwd with path config starts new chain by default', async () => {
      await context.dir('foo', 'bar');
      await newSimpleFossil(context.root).init();

      // root chain with a configured working directory
      const root = newSimpleFossil(await context.path('good'));

      // other chains with their own working directories
      const foo = root.cwd({ path: await context.path('foo') });
      const bar = root.cwd({ path: await context.path('foo', 'bar') });

      const offsets  = await Promise.all([
         showPrefix(foo),
         showPrefix(bar),
         showPrefix(root),
      ]);

      expect(offsets).toEqual(['foo/', 'foo/bar/', 'good/']);
   });

   it('cwd with path config can act on root instance', async () => {
      await context.dir('foo', 'bar');
      await newSimpleFossil(context.root).init();

      // root chain with a configured working directory
      const root = newSimpleFossil(await context.path('good'));

      // other chains with their own working directories
      const foo = root.cwd({ path: await context.path('foo'), root: true });

      const offsets  = await Promise.all([
         showPrefix(foo),
         showPrefix(root),
      ]);

      expect(offsets).toEqual(['foo/', 'foo/']);
   });

   it('switches into new directory - happy path promise', async () => {
      const result = await promiseResult(newSimpleFossil(context.root).cwd(goodDir));
      expect(result).toEqual(expect.objectContaining({
         success: true,
         threw: false,
         result: goodDir,
      }));
   });

   it('switches into new directory - sad path promise', async () => {
      const result = await promiseError(newSimpleFossil(context.root).cwd(badDir));
      assertFossilError(result, badDir);
   });

   it('switches into new directory - chained with callbacks', async () => {
      const spies = [jest.fn(), jest.fn(), jest.fn()];

      newSimpleFossil(context.root)
         .cwd(goodDir, spies[0])
         .cwd(badDir, spies[1])
         .cwd(goodDir, spies[2]);

      await wait(250);

      expect(spies[0]).toHaveBeenCalledWith(null, goodDir);
      expect(spies[1]).toHaveBeenCalledWith(expect.any(Error));
      expect(spies[2]).not.toHaveBeenCalled();

   });

   function showPrefix (fossil: SimpleFossil) {
      return fossil.raw('rev-parse', '--show-prefix').then(s => String(s).trim());
   }
})
