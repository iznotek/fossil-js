import debug from 'debug';
import { closeWithError, closeWithSuccess, newSimpleFossil } from './__fixtures__';

describe('logging', () => {

   const {$enable, $debugEnvironmentVariable, $enabled, $logNames, $logMessagesFor} = require('debug');

   beforeEach(() => {
      $debugEnvironmentVariable('*');
      $enabled(true);
   });

   it('creates a new debug logger for each simpleFossil instance', async () => {
      (debug as any).mockClear();
      newSimpleFossil();
      const logsCreated = (debug as any).mock.calls.length;
      expect(logsCreated).toBeGreaterThanOrEqual(1);

      (debug as any).mockClear();
      newSimpleFossil();
      expect(debug).toHaveBeenCalledTimes(logsCreated);
   });

   it('logs task errors to main log as well as the detailed log', async () => {
      newSimpleFossil().init();
      await closeWithError('Something bad');

      expect($logNames(/^simple-fossil$/, /^simple-fossil:task:*/)).toEqual([
         'simple-fossil',
         'simple-fossil:task:init:1',
      ]);
   });

   it('logs task detail by wild-card', async () => {
      newSimpleFossil().init().clean('f');
      await closeWithSuccess();
      await closeWithSuccess('Removing foo/');

      expect($logNames(/simple-fossil:task:/)).toEqual([
         'simple-fossil:task:init:1',
         'simple-fossil:task:clean:2',
      ]);
   });

   it('logs task detail by type', async () => {
      newSimpleFossil().init().clean('f');
      await closeWithSuccess();
      await closeWithSuccess('Removing foo/');

      expect($logNames(/task:clean/)).toEqual([
         'simple-fossil:task:clean:2',
      ]);
   });

   it('logs task response by wild-card', async () => {
      newSimpleFossil().init().clean('f');
      await closeWithSuccess('Initialised');
      await closeWithSuccess('Removing foo/');

      expect($logNames(/output/)).toHaveLength(2);
      expect($logMessagesFor('simple-fossil:output:init:1')).toMatch('Initialised');
      expect($logMessagesFor('simple-fossil:output:clean:2')).toMatch('Removing foo/');
   });

   it('logs task response by type', async () => {
      newSimpleFossil().init().clean('f');
      await closeWithSuccess();
      await closeWithSuccess('Removing foo/');

      expect($logNames(/output:clean/)).toHaveLength(1);
      expect($logMessagesFor('simple-fossil:output:clean:2')).toMatch('Removing foo/');
   });

   it('when logging is wild-card enabled, silent disables the namespace', async () => {
      newSimpleFossil().silent(true);
      expect($enable).toHaveBeenCalledWith('*,-simple-fossil');
   });

   it('when logging is wild-card enabled, non-silent does nothing', async () => {
      newSimpleFossil().silent(false);
      expect($enable).not.toHaveBeenCalled();
   });

   it('when logging is explicitly enabled, silent removes the namespace', async () => {
      $debugEnvironmentVariable('another,simple-fossil,other');
      newSimpleFossil().silent(true);
      expect($enable).toHaveBeenCalledWith('another,other');
   });

   it('when logging is explicitly enabled, non-silent does nothing', async () => {
      $debugEnvironmentVariable('another,simple-fossil,other');
      newSimpleFossil().silent(false);
      expect($enable).not.toHaveBeenCalled();
   });

   it('when logging is explicitly disabled, silent does nothing', async () => {
      $debugEnvironmentVariable('*,-simple-fossil,-other');
      $enabled(false);
      newSimpleFossil().silent(true);
      expect($enable).not.toHaveBeenCalled();
   });

   it('when logging is explicitly disabled, non-silent does nothing', async () => {
      $debugEnvironmentVariable('*,-simple-fossil,-other');
      $enabled(false);
      newSimpleFossil().silent(false);
      expect($enable).toHaveBeenCalledWith('*,-other');
   });

});
