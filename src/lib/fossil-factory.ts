import { SimpleFossilFactory } from '../../typings';

import api from './api';
import {
   commandConfigPrefixingPlugin,
   errorDetectionHandler,
   errorDetectionPlugin,
   PluginStore,
   progressMonitorPlugin,
   timeoutPlugin
} from './plugins';
import { createInstanceConfig, folderExists } from './utils';
import { SimpleFossilOptions } from './types';

const Fossil = require('../fossil');

/**
 * Adds the necessary properties to the supplied object to enable it for use as
 * the default export of a module.
 *
 * Eg: `module.exports = esModuleFactory({ something () {} })`
 */
export function esModuleFactory<T>(defaultExport: T): T & { __esModule: true, default: T } {
   return Object.defineProperties(defaultExport, {
      __esModule: {value: true},
      default: {value: defaultExport},
   });
}

export function gitExportFactory<T = {}>(factory: SimpleFossilFactory, extra: T) {
   return Object.assign(function (...args: Parameters<SimpleFossilFactory>) {
         return factory.apply(null, args);
      },
      api,
      extra || {},
   );
}

export function gitInstanceFactory(baseDir?: string | Partial<SimpleFossilOptions>, options?: Partial<SimpleFossilOptions>) {
   const plugins = new PluginStore();
   const config = createInstanceConfig(
      baseDir && (typeof baseDir === 'string' ? {baseDir} : baseDir) || {},
      options
   );

   if (!folderExists(config.baseDir)) {
      throw new api.FossilConstructError(config, `Cannot use simple-fossil on a directory that does not exist`);
   }

   if (Array.isArray(config.config)) {
      plugins.add(commandConfigPrefixingPlugin(config.config));
   }

   config.progress && plugins.add(progressMonitorPlugin(config.progress));
   config.timeout && plugins.add(timeoutPlugin(config.timeout));

   plugins.add(errorDetectionPlugin(errorDetectionHandler(true)));
   config.errors && plugins.add(errorDetectionPlugin(config.errors));

   return new Fossil(config, plugins);
}
