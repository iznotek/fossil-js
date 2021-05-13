import { createTestContext, newSimpleFossil, setUpFilesAdded, setUpInit, SimpleFossilTestContext } from '../__fixtures__';

describe('concurrent commands', () => {

   let contexts: { first: SimpleFossilTestContext, second: SimpleFossilTestContext };

   async function configure(context: SimpleFossilTestContext, name: string) {
      await setUpInit(context);
      await setUpFilesAdded(context, [name]);
      await context.fossil.raw('checkout', '-b', name);
      return context;
   }

   beforeEach(async () => {
      contexts = {
         first: await configure(await createTestContext(), 'first'),
         second: await configure(await createTestContext(), 'second'),
      };
   });

   it('will queue tasks to ensure all tasks run eventually', async () => {
      const tests: Array<keyof typeof contexts> = [
         'first', 'second', 'first', 'second', 'first', 'second',
         'second', 'first', 'second', 'first', 'second', 'first'
      ]
      const expected = [...tests];
      const actual = await Promise.all(tests.map(currentBranchForDirectory));

      expect(actual).toEqual(expected);
   });

   function currentBranchForDirectory(dir: keyof typeof contexts) {
      const context = contexts[dir];
      return newSimpleFossil(context.root).branchLocal()
         .then((result) => result.current);
   }

})
