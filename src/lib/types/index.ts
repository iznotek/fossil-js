import { SimpleFossilTask } from './tasks';
import { SimpleFossilProgressEvent } from './handlers';

export * from './handlers';
export * from './tasks';

/**
 * Most tasks accept custom options as an array of strings as well as the
 * options object. Unless the task is explicitly documented as such, the
 * tasks will not accept both formats at the same time, preferring whichever
 * appears last in the arguments.
 */
export type TaskOptions<O extends Options = Options> = string[] | O;

/**
 * Options supplied in most tasks as an optional trailing object
 */
export type OptionsValues = null | string | number;
export type Options = Record<string, OptionsValues>;

export type OptionFlags<FLAGS extends string, VALUE = null> = Partial<Record<FLAGS, VALUE>>;

/**
 * A function called by the executor immediately after creating a child
 * process. Allows the calling application to implement custom handling of
 * the incoming stream of data from the `git`.
 */
export type outputHandler = (
   command: string,
   stdout: NodeJS.ReadableStream,
   stderr: NodeJS.ReadableStream,
   args: string[],
) => void

/**
 * Environment variables to be passed into the child process.
 */
export type FossilExecutorEnv = NodeJS.ProcessEnv | undefined;


/**
 * Public interface of the Executor
 */
export interface SimpleFossilExecutor {
   env: FossilExecutorEnv;
   outputHandler?: outputHandler;
   binary: string;
   cwd: string;

   chain(): SimpleFossilExecutor;

   push<R>(task: SimpleFossilTask<R>): Promise<R>;
}

/**
 * The resulting output from running the git child process
 */
export interface FossilExecutorResult {
   stdOut: Buffer[];
   stdErr: Buffer[];
   exitCode: number;
   rejection: Maybe<Error>;
}

export interface SimpleFossilPluginConfig {

   /**
    * Configures the content of errors thrown by the `simple-fossil` instance for each task
    */
   errors(error: Buffer | Error | undefined, result: Omit<FossilExecutorResult, 'rejection'>): Buffer | Error | undefined;

   /**
    * Handler to be called with progress events emitted through the progress plugin
    */
   progress(data: SimpleFossilProgressEvent): void;

   /**
    * Configuration for the `timeoutPlugin`
    */
   timeout: {

      /**
       * The number of milliseconds to wait after spawning the process / receiving
       * content on the stdOut/stdErr streams before forcibly closing the git process.
       */
      block: number;
   };
}

/**
 * Optional configuration settings to be passed to the `simpleFossil`
 * builder.
 */
export interface SimpleFossilOptions extends Partial<SimpleFossilPluginConfig> {
   baseDir: string;
   binary: string;
   maxConcurrentProcesses: number;
   config: string[];
}

export type Maybe<T> = T | undefined;
export type MaybeArray<T> = T | T[];

export type Primitives = string | number | boolean;
