import { createTestContext, like, newSimpleFossil, setUpInit, SimpleFossilTestContext } from '../__fixtures__';

describe('add', () => {

   let context: SimpleFossilTestContext;

   beforeEach(async () => context = await createTestContext());
   beforeEach(async () => {
      await setUpInit(context);
      await context.files('aaa.txt', 'bbb.txt', 'ccc.other');
   });

   it('adds a single file', async () => {
      await context.fossil.add('aaa.txt');
      expect(await newSimpleFossil(context.root).status()).toEqual(like({
         created: ['aaa.txt'],
         not_added: ['bbb.txt', 'ccc.other'],
      }));
   });

   it('adds multiple files explicitly', async () => {
      await context.fossil.add(['aaa.txt', 'ccc.other']);

      expect(await newSimpleFossil(context.root).status()).toEqual(like({
         created: ['aaa.txt', 'ccc.other'],
         not_added: ['bbb.txt'],
      }));
   });

   it('adds multiple files by wildcard', async () => {
      await context.fossil.add('*.txt');

      expect(await newSimpleFossil(context.root).status()).toEqual(like({
         created: ['aaa.txt', 'bbb.txt'],
         not_added: ['ccc.other'],
      }));
   });
});
