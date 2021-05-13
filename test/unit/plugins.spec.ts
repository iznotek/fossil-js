import { SimpleFossil } from '../../typings';
import {
   assertExecutedCommands,
   assertExecutedCommandsContainsOnce,
   closeWithSuccess,
   newSimpleFossil,
   theChildProcess,
   writeToStdErr,
   writeToStdOut
} from './__fixtures__';

describe('plugins', () => {

   let fossil: SimpleFossil;
   let fn: jest.Mock;

   beforeEach(() => fn = jest.fn());

   it('allows configuration prefixing', async () => {
      fossil = newSimpleFossil({config: ['a', 'bcd']});
      fossil.raw('foo');

      await closeWithSuccess();
      assertExecutedCommands('-c', 'a', '-c', 'bcd', 'foo');
   });

   describe('progress', () => {

      it('emits progress events when counting objects', async () => {
         newSimpleFossil({progress: fn}).raw('something', '--progress');

         await writeToStdErr(`Counting objects: 90% (180/200)`);

         expect(fn).toHaveBeenCalledWith({
            method: 'something',
            progress: 90,
            processed: 180,
            stage: 'counting',
            total: 200,
         });
      });

      it('emits progress events when writing objects', async () => {
         newSimpleFossil({progress: fn}).push();

         await writeToStdErr(`Writing objects: 90% (180/200)`);

         expect(fn).toHaveBeenCalledWith({
            method: 'push',
            progress: 90,
            processed: 180,
            stage: 'writing',
            total: 200,
         });
      });

      it('emits progress events when receiving objects', async () => {
         newSimpleFossil({progress: fn}).raw('something', '--progress');

         await writeToStdErr(`Receiving objects: 5% (1/20)`);

         expect(fn).toHaveBeenCalledWith({
            method: 'something',
            progress: 5,
            processed: 1,
            stage: 'receiving',
            total: 20,
         });
      });

      it('no progress events emitted if --progress flag is not used', async () => {
         newSimpleFossil({progress: fn}).raw('other');

         await writeToStdErr(`Receiving objects: 5% (1/20)`);

         expect(fn).not.toHaveBeenCalled();
      });

      it('handles progress with custom config', async () => {
         fossil = newSimpleFossil({
            progress: fn,
            config: ['foo', '--progress', 'bar'],
         });
         fossil.raw('baz');

         await writeToStdErr(`Receiving objects: 10% (100/1000)`);
         await closeWithSuccess();

         expect(fn).toHaveBeenCalledWith({
            method: 'baz',
            progress: 10,
            processed: 100,
            stage: 'receiving',
            total: 1000,
         });
      });

      it.each<[string, (fossil: SimpleFossil) => unknown]>([
         ['checkout', (fossil) => fossil.checkout('main')],
         ['clone', (fossil) => fossil.clone('some-remote.git')],
         ['fetch', (fossil) => fossil.fetch('some-remote')],
         ['pull', (fossil) => fossil.pull()],
         ['push', (fossil) => fossil.push()],
         ['checkout - progress set', (fossil) => fossil.checkout('main', ['--progress', 'blah'])],
         ['clone - progress set', (fossil) => fossil.clone('some-remote.git', ['--progress', 'blah'])],
         ['fetch - progress set', (fossil) => fossil.fetch('some-remote', {'--progress': null, '--foo': 'bar'})],
         ['pull - progress set', (fossil) => fossil.pull(['--progress', 'blah'])],
         ['push - progress set', (fossil) => fossil.push(['--progress', 'blah'])],
         ['raw - progress set', (fossil) => fossil.raw('foo', '--progress', 'blah')],
      ])(`auto-adds to %s`, async (_name, use) => {
         use(newSimpleFossil({progress: fn}));

         await closeWithSuccess();
         assertExecutedCommandsContainsOnce('--progress');
      });
   });

   describe('timeout', () => {

      beforeEach(() => jest.useFakeTimers());

      it('waits for some time after a block on stdout', async () => {
         fossil = newSimpleFossil({ timeout: { block: 2000 } });
         fossil.init();

         await Promise.resolve();

         const stdOut = Promise.all([
            writeToStdOut('first'),
            writeToStdOut('second'),
         ]);
         jest.advanceTimersByTime(1000);

         await stdOut;
         expect(theChildProcess().kill).not.toHaveBeenCalled();

         jest.advanceTimersByTime(2000);
         expect(theChildProcess().kill).toHaveBeenCalled();
      });

   });

});
