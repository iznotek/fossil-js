import { newSimpleFossil, wait } from './__fixtures__';
import { SimpleFossil } from 'typings';
import { mockChildProcessModule } from './__mocks__/mock-child-process';

async function withStdOut () {
   await wait();
   mockChildProcessModule.$mostRecent().stdout.$emit('data', Buffer.from('some data'));
}

async function withStdErr () {
   await wait();
   mockChildProcessModule.$mostRecent().stdout.$emit('data', Buffer.from('some data'));
}

async function childProcessEmits(event: 'close' | 'exit', code: number, before?: () => Promise<void>) {
   await (before || wait)();
   mockChildProcessModule.$mostRecent().$emit(event, code);
   await wait();
}

const aWhile = () => wait(50);

describe('git-executor', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;
   let task: Promise<any>;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   async function thenTheTaskHasCompleted() {
      expect(callback).toHaveBeenCalledWith(null, await task);
      expect(callback).toHaveBeenCalledTimes(1);
   }

   async function thenTheTaskHasNotCompleted() {
      expect(callback).not.toHaveBeenCalled();
   }

   function givenTheTaskIsAdded() {
      task = fossil.init(callback);
   }

   it('with no stdErr and just a close event, terminates after a delay', async () => {
      givenTheTaskIsAdded();

      await childProcessEmits('close', 0);
      await thenTheTaskHasNotCompleted();

      await aWhile();
      await thenTheTaskHasCompleted()
   });

   it('with no stdErr and just an exit event, terminates after a delay', async () => {
      givenTheTaskIsAdded();

      await childProcessEmits('exit', 0);
      await thenTheTaskHasNotCompleted();

      await aWhile();
      await thenTheTaskHasCompleted()
   });

   it('with stdErr and just a close event, terminates immediately', async () => {
      givenTheTaskIsAdded();

      await childProcessEmits('close', 0, withStdErr);
      await thenTheTaskHasCompleted()
   });

   it('with stdErr and just an exit event, terminates immediately', async () => {
      givenTheTaskIsAdded();

      await childProcessEmits('exit', 0, withStdErr);
      await thenTheTaskHasCompleted()
   });

   it('with stdOut and just a close event, terminates immediately', async () => {
      givenTheTaskIsAdded();

      await childProcessEmits('close', 0, withStdOut);
      await thenTheTaskHasCompleted()
   });

   it('with stdOut and just an exit event, terminates immediately', async () => {
      givenTheTaskIsAdded();

      await childProcessEmits('exit', 0, withStdOut);
      await thenTheTaskHasCompleted()
   });

   it('with both cancel and exit events, only terminates once', async () => {
      givenTheTaskIsAdded();

      await childProcessEmits('close', 0);
      await childProcessEmits('exit', 0);
      await thenTheTaskHasCompleted()
   });

   it('with both exit and cancel events, only terminates once', async () => {
      givenTheTaskIsAdded();

      await childProcessEmits('exit', 0);
      await childProcessEmits('close', 0);
      await thenTheTaskHasCompleted()
   });
});
