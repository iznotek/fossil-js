import {
   createTestContext,
   like,
   newSimpleFossil,
   newSimpleFossilP,
   setUpFilesAdded,
   setUpInit,
   SimpleFossilTestContext
} from '../__fixtures__';

describe('tag', () => {

   let context: SimpleFossilTestContext;

   beforeEach(async () => context = await createTestContext());
   beforeEach(async () => {
      await setUpInit(context);
      await setUpFilesAdded(context, ['foo', 'bar']);
   });

   it('deprecated(fossilP) creates and gets the current named tag', async () => {
      const fossil = newSimpleFossilP(context.root);
      expect(await fossil.addTag('newTag')).toEqual({name: 'newTag'});
      expect(String(await fossil.tag()).trim()).toBe('newTag');
   });

   it('creates and gets the current named tag', async () => {
      const fossil = newSimpleFossil(context.root);
      expect(await fossil.addTag('newTag')).toEqual({name: 'newTag'});
      expect(String(await fossil.tag()).trim()).toBe('newTag');
   });

   it('lists all tags', async () => {
      await context.fossil.raw('tag', 'v1.0');
      await context.fossil.raw('tag', 'v1.5');

      expect(await newSimpleFossil(context.root).tags()).toEqual(like({
         all: ['v1.0', 'v1.5'],
         latest: 'v1.5',
      }));
   });

});
