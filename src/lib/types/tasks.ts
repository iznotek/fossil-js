import { FossilExecutorResult, SimpleFossilExecutor } from './index';
import { EmptyTask } from '../tasks/task';

export type TaskResponseFormat = Buffer | string;

export interface TaskParser<INPUT extends TaskResponseFormat, RESPONSE> {
   (stdOut: INPUT, stdErr: INPUT): RESPONSE;
}

export interface EmptyTaskParser {
   (executor: SimpleFossilExecutor): void;
}

export interface SimpleFossilTaskConfiguration<RESPONSE, FORMAT, INPUT extends TaskResponseFormat> {

   commands: string[]
   format: FORMAT;
   parser: TaskParser<INPUT, RESPONSE>;

   onError?: (
      result: FossilExecutorResult,
      error: Error,
      done: (result: Buffer | Buffer[]) => void,
      fail: (error: string | Error) => void,
   ) => void;
}

export type StringTask<R> = SimpleFossilTaskConfiguration<R, 'utf-8', string>;

export type BufferTask<R> = SimpleFossilTaskConfiguration<R, 'buffer', Buffer>;

export type RunnableTask<R> = StringTask<R> | BufferTask<R>;

export type SimpleFossilTask<R> = RunnableTask<R> | EmptyTask;
