import { assertExecutedCommands, closeWithSuccess, newSimpleFossil } from './__fixtures__';
import { SimpleFossil } from '../../typings';

describe('submodule', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   describe('add', () => {

      it('adds a named sub module', async () => {
         const queue = fossil.submoduleAdd('my_repo', 'at_path', callback);
         closeWithSuccess();

         expect(callback).toBeCalledWith(null, await queue);
         assertExecutedCommands('submodule', 'add', 'my_repo', 'at_path');
      });

   });

   describe('update', () => {

      it('update with no args', async () => {
         const queue = fossil.submoduleUpdate(callback);
         closeWithSuccess();

         expect(callback).toBeCalledWith(null, await queue);
         assertExecutedCommands('submodule', 'update');
      });

      it('update with string arg', async () => {
         const queue = fossil.submoduleUpdate('foo', callback);
         closeWithSuccess();

         expect(callback).toBeCalledWith(null, await queue);
         assertExecutedCommands('submodule', 'update', 'foo');
      });

      it('update with array arg', async () => {
         const queue = fossil.submoduleUpdate(['foo', 'bar'], callback);
         closeWithSuccess();

         expect(callback).toBeCalledWith(null, await queue);
         assertExecutedCommands('submodule', 'update', 'foo', 'bar');
      });
   });

   describe('init', () => {
      it('init with no args', async () => {
         const queue = fossil.submoduleInit(callback);
         closeWithSuccess();

         expect(callback).toBeCalledWith(null, await queue);
         assertExecutedCommands('submodule', 'init');
      });

      it('init with string arg', async () => {
         const queue = fossil.submoduleInit('foo', callback);
         closeWithSuccess();

         expect(callback).toBeCalledWith(null, await queue);
         assertExecutedCommands('submodule', 'init', 'foo');
      });

      it('init with array arg', async () => {
         const queue = fossil.submoduleInit(['foo', 'bar'], callback);
         closeWithSuccess();

         expect(callback).toBeCalledWith(null, await queue);
         assertExecutedCommands('submodule', 'init', 'foo', 'bar');
      });

   });

});
