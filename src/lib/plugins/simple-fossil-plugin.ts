import { ChildProcess } from 'child_process';
import { FossilExecutorResult } from '../types';

type SimpleFossilTaskPluginContext = {
   readonly method: string;
   readonly commands: string[];
}

export interface SimpleFossilPluginTypes {
   'spawn.args': {
      data: string[];
      context: SimpleFossilTaskPluginContext & {};
   };
   'spawn.after': {
      data: void;
      context: SimpleFossilTaskPluginContext & {
         spawned: ChildProcess;
         kill (reason: Error): void;
      };
   },
   'task.error': {
      data: { error?: Error };
      context: SimpleFossilTaskPluginContext & FossilExecutorResult;
   },
}

export type SimpleFossilPluginType = keyof SimpleFossilPluginTypes;

export interface SimpleFossilPlugin<T extends SimpleFossilPluginType> {
   action(data: SimpleFossilPluginTypes[T]['data'], context: SimpleFossilPluginTypes[T]['context']): typeof data;

   type: T;
}
