import { join } from 'path';
import { existsSync, rmdir, mkdir, mkdtemp, writeFile, WriteFileOptions } from 'fs';
import simpleFossil, { SimpleFossil, SimpleFossilOptions } from '..';
import debug from 'debug';

const io = {
  rmdir (path: string): Promise<string> {
    return new Promise((done) => {
       if (!existsSync(path)) {
          return done(path);
       }

       rmdir(path, {recursive: true}, function () { done(path) });
    });
  },
  mkdir (path: string): Promise<string> {
     return new Promise((done, fail) => {
        if (existsSync(path)) {
           return done(path);
        }

        mkdir(path, {recursive: true}, (err) => err ? fail(err) : done(path));
     });
  },
  mkdtemp (): Promise<string> {
     return new Promise((done, fail) => {
        mkdtemp((process.env.TMPDIR || '/tmp/') + 'simple-fossil-test-', (err, path) => {
           err ? fail(err) : done(path);
        });
     });
  },
  writeFile (path: string, content: string, encoding: WriteFileOptions = 'utf-8'): Promise<string> {
     return new Promise((done, fail) => {
        writeFile(path, content, encoding, (err) => {
           err ? fail(err) : done(path);
        })
     })
  }
}

function logError (error: any) {
  console.log(error)
}
function ignoreError () {
  // console.log(error)
}

async function boot () {
  const dbDir = join(process.cwd(), '/fossil');
  const dbFile = join(dbDir, '/test.fossil');
  const repoDir = join(dbDir, '/repo');
  try {
    await io.rmdir(dbDir);
    await io.mkdir(repoDir);
  } catch (e) {
    logError(e) 
  }

  const options: Partial<SimpleFossilOptions> = {
    baseDir: repoDir,
    binary: 'fossil',
    maxConcurrentProcesses: 6,
  };
  debug.enable('off'); // off / *
  const fossil: SimpleFossil = simpleFossil(options);

 
  // begin
  console.log('fossil-js dev app:')
  console.log(options)
  console.log()

  try {
    // await fossil.status().then(logError).catch(logError)
    await fossil.init(dbFile).then(logError).catch(ignoreError)
    await fossil.open(dbFile).then(logError).catch(ignoreError)
    await fossil.status().then(logError).catch(ignoreError)
  }
  catch (e) {
    logError(e) 
  }
}

boot()