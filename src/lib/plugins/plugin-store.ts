import { SimpleFossilPlugin, SimpleFossilPluginType, SimpleFossilPluginTypes } from './simple-fossil-plugin';
import { append, asArray } from '../utils';

export class PluginStore {

   private plugins: Set<SimpleFossilPlugin<SimpleFossilPluginType>> = new Set();

   public add<T extends SimpleFossilPluginType>(plugin: void | SimpleFossilPlugin<T> | SimpleFossilPlugin<T>[]) {
      const plugins: SimpleFossilPlugin<T>[] = [];

      asArray(plugin).forEach(plugin => plugin && this.plugins.add(append(plugins, plugin)));

      return () => {
         plugins.forEach(plugin => this.plugins.delete(plugin));
      };
   }

   public exec<T extends SimpleFossilPluginType>(type: T, data: SimpleFossilPluginTypes[T]['data'], context: SimpleFossilPluginTypes[T]['context']): typeof data {
      let output = data;
      const contextual = Object.freeze(Object.create(context));

      for (const plugin of this.plugins) {
         if (plugin.type === type) {
            output = plugin.action(output, contextual);
         }
      }

      return output;
   }

}
