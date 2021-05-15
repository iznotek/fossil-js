import { InitResult, SimpleFossil } from 'typings';
import { assertExecutedCommands, closeWithSuccess, newSimpleFossil, wait } from './__fixtures__';
import { InitSummary } from '../../src/lib/responses/InitSummary';

describe('init', () => {

   let fossil: SimpleFossil;
   const path = '/some/path/repo';

   const successMessage = (alreadyExisting = false, fossilDir = `${path}/.git/`) =>
      alreadyExisting
         ? `Reinitialized existing Fossil repository in ${ fossilDir }\n`
         : `Initialized empty Fossil repository in ${ fossilDir }\n`;
   const existingRepoSuccess = successMessage.bind(null, true);
   const newRepoSuccess = successMessage.bind(null, false);

   beforeEach(() => fossil = newSimpleFossil(path));

   describe('path vs fossilDir', () => {
      it('non-bare', async () => {
         const fossilDir = `${path}/.git/`;
         const init = fossil.init();

         await closeWithSuccess(newRepoSuccess(fossilDir));
         assertSuccess(await init, {path, fossilDir}, ['init']);
      });
      it('bare', async () => {
         const fossilDir = `${path}/`;
         const init = fossil.init(true);

         await closeWithSuccess(newRepoSuccess(fossilDir));
         assertSuccess(await init, {path, fossilDir}, ['init', '--bare']);
      });
   });

   it('await with no arguments', async () => {
      const init = fossil.init();

      await closeWithSuccess(existingRepoSuccess());
      assertSuccess(await init, {bare: false, existing: true}, ['init']);
   });

   it.each([true, false])(`await bare=%s with no options`, async (bare) => {
      const init = fossil.init(bare);
      const expected = bare ? ['init', '--bare'] : ['init'];

      await closeWithSuccess(existingRepoSuccess());
      assertSuccess(await init, {bare, existing: true}, expected);
   });

   it.each([true, false])(`await bare=%s with options array`, async (bare) => {
      const init = fossil.init(bare, ['--quiet']);
      const expected = bare ? ['init', '--bare'] : ['init'];

      await closeWithSuccess(existingRepoSuccess());
      assertSuccess(await init, {bare, existing: true}, [...expected, '--quiet']);
   });

   it.each([true, false])(`await bare=%s with options object`, async (bare) => {
      const init = fossil.init(bare, {'--shared': 'true'});
      const expected = bare ? ['init', '--bare'] : ['init'];

      await closeWithSuccess(newRepoSuccess());
      assertSuccess(await init, {bare, existing: false}, [...expected, '--shared=true']);
   });

   it('await with options object', async () => {
      const init = fossil.init({'--shared': 'true'});

      await closeWithSuccess(newRepoSuccess());
      assertSuccess(await init, {bare: false, existing: false}, ['init', '--shared=true']);
   });

   it('await with options array', async () => {
      const init = fossil.init(['--quiet', '--bare']);

      await closeWithSuccess(newRepoSuccess());
      assertSuccess(await init, {bare: true, existing: false}, ['init', '--quiet', '--bare']);
   });

   it('ignores bad data types for the bare parameter', async () => {
      const init = fossil.init('hello' as any, ['--quiet']);

      await closeWithSuccess(newRepoSuccess());
      assertSuccess(await init, {bare: false, existing: false}, ['init', '--quiet']);
   });

   it('removes duplicate --bare flags', async () => {
      const init = fossil.init(true, ['--quiet', '--bare']);
      await closeWithSuccess(existingRepoSuccess());
      assertSuccess(await init, {bare: true, existing: true}, ['init', '--quiet', '--bare']);
   });

   describe('callbacks', () => {
      let callback: jest.Mock;
      beforeEach(() => callback = jest.fn());

      it('no arguments', async () => {
         fossil.init(mockSuccessCallback({bare: false, existing: false}, ['init']));
         await closeWithSuccess(newRepoSuccess());
         await wait();

         expect(callback).toHaveBeenCalled();
      });

      it('with bare', async () => {
         fossil.init(true, mockSuccessCallback({bare: true, existing: false}, ['init', '--bare']));
         await closeWithSuccess(newRepoSuccess());
         await wait();

         expect(callback).toHaveBeenCalled();
      });

      it('with bare and options object', async () => {
         fossil.init(true, {'--a': 'b'}, mockSuccessCallback({bare: true, existing: false}, ['init', '--bare', '--a=b']));
         await closeWithSuccess(newRepoSuccess());
         await wait();

         expect(callback).toHaveBeenCalled();
      });

      it('with bare and options array', async () => {
         fossil.init(false, ['--foo'], mockSuccessCallback({bare: false, existing: true}, ['init', '--foo']));
         await closeWithSuccess(existingRepoSuccess());
         await wait();

         expect(callback).toHaveBeenCalled();
      });

      it('with options array', async () => {
         fossil.init(['--foo'], mockSuccessCallback({bare: false, existing: true}, ['init', '--foo']));
         await closeWithSuccess(existingRepoSuccess());
         await wait();

         expect(callback).toHaveBeenCalled();
      });

      it('with options object', async () => {
         fossil.init({'--a': 'b'}, mockSuccessCallback({bare: false, existing: false}, ['init', '--a=b']));
         await closeWithSuccess(newRepoSuccess());
         await wait();

         expect(callback).toHaveBeenCalled();
      });

      function mockSuccessCallback (expected: Partial<InitResult>, commands: string[]): jest.Mock {
         return callback = jest.fn((_err, init) => {
            assertSuccess(init, expected, commands);
         });
      }
   })


   function assertSuccess (init: InitResult, expected: Partial<InitResult>, commands: string[]) {
      expect(init).toBeInstanceOf(InitSummary);
      expect(init).toEqual(expect.objectContaining(expected));
      assertExecutedCommands(...commands);
   }
})
