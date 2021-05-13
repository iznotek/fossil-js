## Changing Working Directory

To change the directory the `git` commands are run in you can either configure the `simple-fossil` instance
when it is created by using the `baseDir` property:

```typescript
import { join } from 'path';
import simpleFossil from 'simple-fossil';

const git = simpleFossil({ baseDir: join(__dirname, 'repos') });
```

Or explicitly set the working directory at some later time, for example after cloning a repo:

```typescript
import { join } from 'path';
import simpleFossil, { SimpleFossil } from 'simple-fossil';

const remote = `https://github.com/steveukx/git-js.git`;
const target = join(__dirname, 'repos', 'git-js');

// repo is now a `SimpleFossil` instance operating on the `target` directory
// having cloned the remote repo then switched into the cloned directory
const repo: SimpleFossil = await simpleFossil().clone(remote, target).cwd({ path: target });
```

In the example above we're using the command chaining feature of `simple-fossil` where many commands
are treated as an atomic operation. To rewrite this using separate `async/await` steps would be:

```typescript
import { join } from 'path';
import simpleFossil, { SimpleFossil } from 'simple-fossil';

const remote = `https://github.com/steveukx/git-js.git`;
const target = join(__dirname, 'repos', 'git-js');

// create a `SimpleFossil` instance 
const git: SimpleFossil = simpleFossil();

// use that instance to do the clone
await fossil.clone(remote, target);

// then set the working directory of the root instance - you want all future
// tasks run through `git` to be from the new directory, rather than just tasks
// chained off this task
await fossil.cwd({ path: target, root: true });
```
