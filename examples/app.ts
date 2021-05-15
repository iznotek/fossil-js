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

function formatOutput (text: string) {
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

function formatOutputArtifact (text: string) {
  let json: any = { files: [] }
  const lines = text.trim().split('\n');
  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i];
    const limit = line.indexOf(' ');
    const left = line.substr(0, limit);
    const value = line.substr(limit+1, line.length).trim()
    let key = 'out';
    switch(left) {
      case 'C': key = 'comment'; break;
      case 'D': key = 'date'; break;
      case 'F': key = 'files'; break;
      case 'P': key = 'parent'; break;
      case 'R': key = 'revision'; break;
      case 'U': key = 'user'; break;
      // case 'Z': key = 'comment'; break;
    }
    if (key == 'out') continue;
    if (key == 'files') {
      json[key].push(value)
      continue;
    }
    json[key] = value 
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
  const dbUrl = "https://fossil.2of4.net/mc_tools";
  const repoNew= join(dbDir, '/new');
  const repoOpen = join(dbDir, '/open');
  const repoClone = join(dbDir, '/clone');
  try {
    await io.rmdir(dbDir);
    await io.mkdir(repoNew);
    await io.mkdir(repoOpen);
    await io.mkdir(repoClone);
  } catch (e) {
    logError(e) 
  }

  const options: Partial<SimpleFossilOptions> = {
    baseDir: repoNew,
    binary: 'fossil',
    maxConcurrentProcesses: 6,
  };
  debug.enable('simple-fossil,simple-fossil:output:*'); // off / * / 'simple-fossil,simple-fossil:output:*'
  const fossil: SimpleFossil = simpleFossil(options);

 
  // begin 
  console.log('fossil-js dev app:')
  console.log(options)
  console.log()

  try {
    // await fossil.status().then(logError).catch(logError)
    await fossil.init(dbFile).open(dbFile).then(logError).catch(ignoreError)
    await fossil.cwd(repoClone).clone(dbUrl).then(logError).catch(ignoreError)
    await fossil.getRemotes().then(logError).catch(ignoreError)
    await fossil.cwd(repoOpen).open(dbUrl).then(logError).catch(ignoreError)
    await io.writeFile(join(repoNew,'new.txt'), 'something in');
    await fossil.cwd(repoNew).status().then(logError).catch(ignoreError)
    await fossil.add('new.txt').then(logError).catch(ignoreError)
    await fossil.status().then(logError).catch(ignoreError)
    await fossil.commit('first commit').then(async (res) => {
      await fossil.raw(['info', res.revision]).then((res) => {
        console.log(formatOutput(res))
      }).catch(logError)
      await fossil.raw(['artifact', res.revision]).then((res) => {
        console.log(formatOutputArtifact(res))
      }).catch(logError)
    }).catch(ignoreError)
    await fossil.status().then(logError).catch(ignoreError)
    await fossil.branch().then(logError).catch(ignoreError)
    
  }
  catch (e) {
    logError(e) 
  }
}

boot()