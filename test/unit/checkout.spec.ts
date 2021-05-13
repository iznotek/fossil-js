import { SimpleFossil } from 'typings';
import { assertExecutedCommands, closeWithSuccess, newSimpleFossil, wait } from './__fixtures__';

describe('checkout', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it('checkout with trailing options array', async () => {
      const queue = fossil.checkout('something', ['--track', 'upstream/something']);

      await closeWithSuccess();
      await queue;

      assertExecutedCommands('checkout', 'something', '--track', 'upstream/something');
   })

   it('checkout with trailing options object', async () => {
      const queue = fossil.checkout('something', {'--track': null, 'upstream/something': null});

      await closeWithSuccess();
      await queue;

      assertExecutedCommands('checkout', 'something', '--track', 'upstream/something');
   });

   it('checkout with just trailing options array', async () => {
      const queue = fossil.checkout(['-b', 'foo']);

      await closeWithSuccess();
      await queue;

      assertExecutedCommands('checkout', '-b', 'foo');
   })

   it('checkout with just trailing options object', async () => {
      const queue = fossil.checkout({'-b': null, 'my-branch': null});

      await closeWithSuccess();
      await queue;

      assertExecutedCommands('checkout', '-b', 'my-branch');
   });

   it('simple checkout with callback', async function () {
      fossil.checkout('something', callback);

      await closeWithSuccess();
      await wait();

      expect(callback).toHaveBeenCalledWith(null, expect.any(String));
      assertExecutedCommands('checkout', 'something');
   });

   describe('checkoutLocalBranch', () => {
      it('with callback', async () => {
         fossil.checkoutLocalBranch('new-branch', callback);
         await closeWithSuccess();
         await wait();

         expect(callback).toHaveBeenCalledWith(null, expect.any(String));
         assertExecutedCommands('checkout', '-b', 'new-branch');
      });

      it('as promise', async () => {
         const queue = fossil.checkoutLocalBranch('new-branch');
         await closeWithSuccess();
         await queue;

         assertExecutedCommands('checkout', '-b', 'new-branch');
      });
   });

   describe('checkoutBranch', () => {

      it('with callback', async function () {
         fossil.checkoutBranch('branch', 'start', callback);

         await closeWithSuccess();
         await wait();

         expect(callback).toHaveBeenCalledWith(null, expect.any(String));
         assertExecutedCommands('checkout', '-b', 'branch', 'start');
      });

      it('as promise', async function () {
         const result = fossil.checkoutBranch('abc', 'def');

         await closeWithSuccess();
         expect(await result).toEqual(expect.any(String));
         assertExecutedCommands('checkout', '-b', 'abc', 'def');
      });

   });

});
