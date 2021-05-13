import { PluginStore } from '../plugins';
import { FossilExecutorEnv, outputHandler, SimpleFossilExecutor, SimpleFossilTask } from '../types';

import { FossilExecutorChain } from './fossil-executor-chain';
import { Scheduler } from './scheduler';

export class FossilExecutor implements SimpleFossilExecutor {

   private _chain = new FossilExecutorChain(this, this._scheduler, this._plugins);

   public env: FossilExecutorEnv;
   public outputHandler?: outputHandler;

   constructor(
      public binary: string = 'fossil',
      public cwd: string,
      private _scheduler: Scheduler,
      private _plugins: PluginStore,
   ) {
   }

   chain(): SimpleFossilExecutor {
      return new FossilExecutorChain(this, this._scheduler, this._plugins);
   }

   push<R>(task: SimpleFossilTask<R>): Promise<R> {
      return this._chain.push(task);
   }

}


