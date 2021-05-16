import { FossilConstructError } from './errors/fossil-construct-error';
import { FossilError } from './errors/fossil-error';
import { FossilPluginError } from './errors/fossil-plugin-error';
import { FossilResponseError } from './errors/fossil-response-error';
import { TaskConfigurationError } from './errors/task-configuration-error';
import { CleanOptions } from './tasks/clean';

const api = {
   CleanOptions,
   FossilConstructError,
   FossilError,
   FossilPluginError,
   FossilResponseError,
   TaskConfigurationError,
}

export default api;
