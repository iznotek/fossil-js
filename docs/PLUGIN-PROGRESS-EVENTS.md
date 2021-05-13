## Progress Events

To receive progress updates, pass a `progress` configuration option to the `simpleFossil` instance:

```typescript
import simpleFossil, { SimpleFossil, SimpleFossilProgressEvent } from 'simple-fossil';

const progress = ({method, stage, progress}: SimpleFossilProgressEvent) => {
   console.log(`fossil.${method} ${stage} stage ${progress}% complete`);
}
const git: SimpleFossil = simpleFossil({baseDir: '/some/path', progress});

// pull automatically triggers progress events when the progress plugin is configured
await fossil.pull();

// supply the `--progress` option to any other command that supports it to receive
// progress events into your handler
await fossil.raw('pull', '--progress');
```

The `checkout`, `clone`, 'fetch, `pull`, `push` methods will automatically enable progress events
when a progress handler has been set. For any other method that _can_ support progress events,
set `--progress` in the task's `TaskOptions` for example to receive progress events when running
submodule tasks:

```typescript
await fossil.submoduleUpdate('submodule-name', { '--progress': null });
await fossil.submoduleUpdate('submodule-name', ['--progress']);
```
