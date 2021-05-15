import { OpenResult } from '../../../typings';

export class OpenSummary implements OpenResult {
   constructor(
      public readonly projectName: string,
      public readonly repository: string,
      public readonly localRoot: string,
      public readonly configDb: string,
      public readonly projectCode: string,
      public readonly checkout: string,
      public readonly tags: string,
      public readonly comment: string,
      public readonly checkIns: number
   ) {}
}

const projectNameResponseRegex = /project-name:(.*)/;
const repositoryResponseRegex  = /repository:(.*)/;
const localRootResponseRegex   = /local-root:(.*)/;
const configDbResponseRegex    = /config-db:(.*)/;
const projectCodeResponseRegex = /project-code:(.*)/;
const checkoutResponseRegex    = /checkout:(.*)/;
const tagsDbResponseRegex      = /tags:(.*)/;
const commentResponseRegex     = /comment:(.*)/;
const checkInsResponseRegex    = /check-ins:(.*)/;

export function parseOpen(text: string) {
   const response = String(text).trim();
   let result;
   let projectName, repository, localRoot, configDb, projectCode, checkout, tags, comment, checkIns;

   if ((result = projectNameResponseRegex.exec(response))) { 
      projectName = result[1].trim();

      if ((result = repositoryResponseRegex.exec(response))) { 
         repository = result[1].trim();
      }

      if ((result = localRootResponseRegex.exec(response))) { 
         localRoot = result[1].trim();
      }

      if ((result = configDbResponseRegex.exec(response))) { 
         configDb = result[1].trim();
      }

      if ((result = projectCodeResponseRegex.exec(response))) { 
         projectCode = result[1].trim();
      }

      if ((result = checkoutResponseRegex.exec(response))) { 
         checkout = result[1].trim();
      }

      if ((result = tagsDbResponseRegex.exec(response))) { 
         tags = result[1].trim();
      }

      if ((result = commentResponseRegex.exec(response))) { 
         comment = result[1].trim();
      }

      if ((result = checkInsResponseRegex.exec(response))) { 
         checkIns = +result[1].trim() || -1;
      }
   }

   return new OpenSummary(
      projectName || '', 
      repository || '', 
      localRoot || '', 
      configDb || '', 
      projectCode || '',
      checkout || '', 
      tags || '', 
      comment || '', 
      checkIns || 0
   );
}
