## Task Timeouts

To handle the case where the underlying `git` processes appear to hang, configure the
`timeout` plugin with a number of milliseconds to wait after last received content on either
`stdOut` or `stdErr` streams before sending a `SIGINT` kill message.

```typescript
import simpleFossil, { FossilPluginError, SimpleFossil, SimpleFossilProgressEvent } from 'simple-fossil';

const git: SimpleFossil = simpleFossil({
   baseDir: '/some/path', 
   timeout: {
       block: 2000,
   },
});

// if the `git pull` process fails to send content to the `stdOut` or `stdErr`
// streams for 2 seconds, simple-fossil will kill it with a SIGINT
try {
    await fossil.pull();
}
catch (err) {
    if (err instanceof FossilPluginError && err.plugin === 'timeout') {
        // task failed because of a timeout
    }
}
```
