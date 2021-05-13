import { SimpleFossil } from 'typings';
import {
   assertExecutedCommands,
   assertNoExecutedTasks,
   closeWithSuccess,
   newSimpleFossil,
   newSimpleFossilP,
   wait
} from './__fixtures__';

import { TaskConfigurationError } from '../..';
import { CleanResponse, cleanSummaryParser } from '../../src/lib/responses/CleanSummary';
import {
   CleanOptions,
   CONFIG_ERROR_INTERACTIVE_MODE,
   CONFIG_ERROR_MODE_REQUIRED,
   CONFIG_ERROR_UNKNOWN_OPTION
} from '../../src/lib/tasks/clean';


describe('clean', () => {

   let fossil: SimpleFossil;

   describe('parser', () => {

      function parserTest(dryRun: boolean, prefix: string) {
         const summary = cleanSummaryParser(dryRun, `
            ${prefix} a
            ${prefix} b/
            ${prefix} c
         `);

         expect(summary).toBeInstanceOf(CleanResponse);
         expect(summary).toEqual(expect.objectContaining({
            dryRun,
            paths: ['a', 'b/', 'c'],
            files: ['a', 'c'],
            folders: ['b/'],
         }));
      }

      it('recognises items in dry run', () => {
         parserTest(true, 'Would remove');
      });

      it('recognises items in force', () => {
         parserTest(false, 'Removing');
      });

   });

   describe('promises', () => {
      beforeEach(() => fossil = newSimpleFossilP());

      it('cleans', async () => {
         const cleanedP = fossil.clean(CleanOptions.FORCE);
         await closeWithSuccess(`
            Removing a
            Removing b/
         `);

         const cleaned = await cleanedP;
         expect(cleaned).toBeInstanceOf(CleanResponse);
         expect(cleaned).toEqual(expect.objectContaining({
            paths: ['a', 'b/'],
            files: ['a'],
            folders: ['b/'],
         }));
      });

      it('options combined as a string', async () => {
         closeWithSuccess();
         await fossil.clean(CleanOptions.FORCE + CleanOptions.RECURSIVE);
         assertExecutedCommands('clean', '-f', '-d')
      });

      it('cleans multiple paths', async () => {
         closeWithSuccess();
         await fossil.clean(CleanOptions.FORCE, ['./path-1', './path-2']);
         assertExecutedCommands('clean', '-f', './path-1', './path-2')
      });

      it('cleans with options and multiple paths', async () => {
         closeWithSuccess();
         await fossil.clean(CleanOptions.IGNORED_ONLY + CleanOptions.FORCE, {'./path-1': null, './path-2': null});
         assertExecutedCommands('clean', '-f', '-X', './path-1', './path-2')
      });

      it('handles configuration errors', async () => {
         const err = await (fossil.clean('X').catch(e => e));

         expectTheError(err).toBe(CONFIG_ERROR_MODE_REQUIRED);
      });

   });

   describe('callbacks', () => {

      beforeEach(() => fossil = newSimpleFossil());

      it('cleans with dfx', test((done) => {
         fossil.clean('dfx', function (err: null | Error) {
            expect(err).toBeNull();
            assertExecutedCommands('clean', '-f', '-d', '-x')
            done();
         });
         closeWithSuccess();
      }));

      it('missing required n or f in mode', test((done) => {
         fossil.clean('x', function (err: null | Error) {
            expectTheError(err).toBe(CONFIG_ERROR_MODE_REQUIRED);
            expectNoTasksToHaveBeenRun();
            done();
         });
      }));

      it('unknown options', test((done) => {
         fossil.clean('fa', function (err: null | Error) {
            expectTheError(err).toBe(CONFIG_ERROR_UNKNOWN_OPTION);
            expectNoTasksToHaveBeenRun();
            done();
         });
      }));

      it('no args', test((done) => {
         fossil.clean(function (err: null | Error) {
            expectTheError(err).toBe(CONFIG_ERROR_MODE_REQUIRED);
            expectNoTasksToHaveBeenRun();
            done();
         });
      }));

      it('just show no directories', test((done) => {
         fossil.clean('n', function (err: null | Error) {
            expect(err).toBeNull();
            assertExecutedCommands('clean', '-n')
            done();
         });
         closeWithSuccess();
      }));

      it('just show', test((done) => {
         fossil.clean('n', ['-d'], function (err: null | Error) {
            expect(err).toBeNull();
            assertExecutedCommands('clean', '-n', '-d')
            done();
         });
         closeWithSuccess('Would remove install.js');
      }));

      it('force clean space', test((done) => {
         fossil.clean('f', ['-d'], function (err: null | Error) {
            expect(err).toBeNull();
            assertExecutedCommands('clean', '-f', '-d')
            done();
         });
         closeWithSuccess();
      }));

      it('clean ignored files', test((done) => {
         fossil.clean('f', ['-x', '-d'], function (err: null | Error) {
            expect(err).toBeNull();
            assertExecutedCommands('clean', '-f', '-x', '-d')
            done();
         });
         closeWithSuccess();
      }));

      it('prevents interactive mode - shorthand option', test((done) => {
         fossil.clean('f', ['-i'], function (err: null | Error) {
            expectTheError(err).toBe(CONFIG_ERROR_INTERACTIVE_MODE);
            expectNoTasksToHaveBeenRun();

            done();
         });
      }));

      it('prevents interactive mode - shorthand mode', test((done) => {
         fossil.clean('fi', function (err: null | Error) {
            expectTheError(err).toBe(CONFIG_ERROR_INTERACTIVE_MODE);
            expectNoTasksToHaveBeenRun();

            done();
         });
      }));

      it('prevents interactive mode - longhand option', test((done) => {
         fossil.clean('f', ['--interactive'], function (err: null | Error) {
            expectTheError(err).toBe(CONFIG_ERROR_INTERACTIVE_MODE);
            expectNoTasksToHaveBeenRun();

            done();
         });
      }));
   });

   function expectNoTasksToHaveBeenRun() {
      assertNoExecutedTasks();
   }

   function expectTheError<E extends Error>(err: E | null) {
      return {
         toBe(message: string) {
            expect(err).toBeInstanceOf(TaskConfigurationError);
            expect(String(err)).toMatch(message);
         }
      }
   }

   function test(t: (done: Function) => void) {
      return async () => {
         await (new Promise(done => t(done)));
         await wait();
      };
   }

});
