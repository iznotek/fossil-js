import { FossilConstructError } from './errors/fossil-construct-error';
import { FossilError } from './errors/fossil-error';
import { FossilPluginError } from './errors/fossil-plugin-error';
import { FossilResponseError } from './errors/fossil-response-error';
import { TaskConfigurationError } from './errors/task-configuration-error';
import { CheckRepoActions } from './tasks/check-is-repo';
import { CleanOptions } from './tasks/clean';
import { ResetMode } from './tasks/reset';

const api = {
   CheckRepoActions,
   CleanOptions,
   FossilConstructError,
   FossilError,
   FossilPluginError,
   FossilResponseError,
   ResetMode,
   TaskConfigurationError,
}

export default api;
