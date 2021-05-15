import { InitResult } from '../../../typings';

export class InitSummary implements InitResult {
   constructor(
      public readonly path: string,
      public readonly projectId: string,
      public readonly serverId: string,
      public readonly admin: string,
      public readonly password: string,
   ) {}
}

const projectResponseRegex = /^project-id:(.*)/;
const serverResponseRegex = /server-id:(.*)/;
const adminResponseRegex = /admin-user:(.*) \(/;
const passwordResponseRegex = /initial password is "(.*)"/;

export function parseInit(path: string, text: string) {
   const response = String(text).trim();
   let result;
   let projectId, serverId, admin, password;

   if ((result = projectResponseRegex.exec(response))) { 
      projectId = result[1];

      if ((result = serverResponseRegex.exec(response))) { 
         serverId = result[1];
      }

      if ((result = adminResponseRegex.exec(response))) { 
         admin = result[1];
      }

      if ((result = passwordResponseRegex.exec(response))) { 
         password = result[1];
      }
   }

   return new InitSummary(path, projectId || '', serverId || '', admin || '', password || '');
}
