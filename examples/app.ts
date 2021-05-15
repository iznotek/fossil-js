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

function outputToJson (text: string) {
  let json: any = {}
  const lines = text.trim().split('\n');
  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i];
    const limit = line.indexOf(':');
    const key = line.substr(0, limit);
    const value = line.substr(limit+1, line.length)
    json[key] = value.trim()
  }
  return json;
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
  debug.enable('simple-fossil,simple-fossil:output:*'); // off / *
  const fossil: SimpleFossil = simpleFossil(options);

 
  // begin
  console.log('fossil-js dev app:')
  console.log(options)
  console.log()

  try {
    // await fossil.status().then(logError).catch(logError)
    await fossil.init(dbFile).then(logError).catch(ignoreError)
    await fossil.open(dbFile).then(logError).catch(ignoreError)
    await io.writeFile(join(repoDir,'new.txt'), 'something in');
    await fossil.status().then(logError).catch(ignoreError)
    await fossil.add('new.txt').then(logError).catch(ignoreError)
    await fossil.status().then(logError).catch(ignoreError)
    await fossil.commit('first commit').then(async (res) => {
      await fossil.raw(['info', res.revision]).then((res) => {
        console.log(outputToJson(res))
      }).catch(logError)
    }).catch(ignoreError)
    await fossil.status().then(logError).catch(ignoreError)
  }
  catch (e) {
    logError(e) 
  }
}

boot()