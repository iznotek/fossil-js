import { SimpleFossil, TaskOptions } from 'typings';
import { assertExecutedCommands, assertFossilError, closeWithSuccess, newSimpleFossil, newSimpleFossilP } from './__fixtures__';
import { promiseError, promiseResult } from '@kwsites/promise-result';

describe('applyPatch', () => {

   describe('commands', () => {
      let fossil: SimpleFossil;

      const applyPatchTests: [keyof SimpleFossil, string, Array<string | TaskOptions>, string[]][] = [
         ['applyPatch', 'with one file', ['./diff'], ['apply', './diff']],
         ['applyPatch', 'with multiple files', [['./diff1', './diff2']], ['apply', './diff1', './diff2']],
         ['applyPatch', 'with options array', ['./diff', ['--stat']], ['apply', '--stat', './diff']],
         ['applyPatch', 'with options object', ['./diff', {'-p': 2}], ['apply', '-p=2', './diff']],
      ];

      beforeEach(() => fossil = newSimpleFossil());

      it.each(applyPatchTests)('callbacks - %s %s', async (api, name, applyPatchArgs, executedCommands)=> {
         const callback = jest.fn();
         const queue = (fossil[api] as any)(...applyPatchArgs, callback);
         await closeWithSuccess(name);

         expect(await queue).toBe(name);
         expect(callback).toHaveBeenCalledWith(null, name);
         assertExecutedCommands(...executedCommands);
      });

      it.each(applyPatchTests)(`promises - %s %s`, async (api, name, applyPatchArgs, executedCommands) => {
         const queue = (fossil[api] as any)(...applyPatchArgs);
         await closeWithSuccess(name);

         expect(await queue).toBe(name);
         assertExecutedCommands(...executedCommands);
      });

      it.each(applyPatchTests)(`(legacy) promise usage - %s %s`, async (_api, name, applyPatchArgs, executedCommands) => {
         const queue = newSimpleFossilP().applyPatch(...applyPatchArgs);
         await closeWithSuccess(name);

         expect(await queue).toBe(name);
         assertExecutedCommands(...executedCommands);
      });
   });

   describe('usage', () => {
      let callback: jest.Mock;

      const tests: Array<[string, RegExp | null, 'Y' | 'N', (fossil: SimpleFossil) => Promise<string>]> = [
         ['patch   - no-opt     - no-callback  ', null, 'N', (fossil) => fossil.applyPatch('foo')],
         ['patch   - array-opt  - no-callback  ', null, 'N', (fossil) => fossil.applyPatch('foo', ['--opt'])],
         ['patch   - object-opt - no-callback  ', null, 'N', (fossil) => fossil.applyPatch('foo', {'--opt': null})],
         ['patch   - no-opt     - with-callback', null, 'Y', (fossil) => fossil.applyPatch('foo', callback)],
         ['patch   - array-opt  - with-callback', null, 'Y', (fossil) => fossil.applyPatch('foo', ['--opt'], callback)],
         ['patch   - object-opt - with-callback', null, 'Y', (fossil) => fossil.applyPatch('foo', {'--opt': null}, callback)],
         ['patches - no-opt     - no-callback  ', null, 'N', (fossil) => fossil.applyPatch(['foo', 'bar'])],
         ['patches - array-opt  - no-callback  ', null, 'N', (fossil) => fossil.applyPatch(['foo', 'bar'], ['--opt'])],
         ['patches - object-opt - no-callback  ', null, 'N', (fossil) => fossil.applyPatch(['foo', 'bar'], {'--opt': null})],
         ['patches - no-opt     - with-callback', null, 'Y', (fossil) => fossil.applyPatch(['foo', 'bar'], callback)],
         ['patches - array-opt  - with-callback', null, 'Y', (fossil) => fossil.applyPatch(['foo', 'bar'], ['--opt'], callback)],
         ['patches - object-opt - with-callback', null, 'Y', (fossil) => fossil.applyPatch(['foo', 'bar'], {'--opt': null}, callback)],

         ['error: no patches', /string patches/, 'N', (fossil) => fossil.applyPatch({'--opt': null} as any)],
      ];

      const noCallbackTests = tests.filter(t => t[2] === 'N');

      beforeEach(() => callback = jest.fn());

      it.each(tests)(`fossil.applyPatch %s`, async (name, error, withCallback, task) => {
         const result = task(newSimpleFossil());

         if (error) {
            return assertFossilError(await promiseError(result), error);
         }

         await closeWithSuccess(name);
         expect(await result).toBe(name);

         if (withCallback === 'Y') {
            expect(callback).toHaveBeenCalledWith(null, name);
         }
      });

      it.each(noCallbackTests)(`fossilP.applyPatch %s`, async (name, error, _withCallback, task) => {
         const result = promiseResult(task(newSimpleFossilP()));

         if (error) {
            return assertFossilError((await result).result, error);
         }

         await closeWithSuccess(name);
         expect((await result).result).toBe(name);
      });
   });
});
