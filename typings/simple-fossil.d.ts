import * as resp from './response';
import * as types from './types';
import { FossilError } from './errors';

export interface SimpleFossilFactory {
   (baseDir?: string, options?: Partial<types.SimpleFossilOptions>): SimpleFossil;

   (baseDir: string): SimpleFossil;

   (options: Partial<types.SimpleFossilOptions>): SimpleFossil;
}

export type Response<T> = SimpleFossil & Promise<T>;

export interface SimpleFossilBase {
   /**
    * Adds one or more files to source control
    */
   add(files: string | string[], callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Sets the working directory of the subsequent commands.
    */
   cwd(directory: { path: string, root?: boolean }, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;
   cwd<path extends string>(directory: path, callback?: types.SimpleFossilTaskCallback<path>): Response<path>;

   /**
    * Pushes the current committed changes to a remote, optionally specify the names of the remote and branch to use
    * when pushing. Supply multiple options as an array of strings in the first argument - see examples below.
    */
   push(remote?: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.PushResult>): Response<resp.PushResult>;

   push(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.PushResult>): Response<resp.PushResult>;

   push(callback?: types.SimpleFossilTaskCallback<resp.PushResult>): Response<resp.PushResult>;

}

export interface SimpleFossil extends SimpleFossilBase {

   /**
    * Add an annotated tag to the head of the current branch
    */
   addAnnotatedTag(tagName: string, tagMessage: string, callback?: types.SimpleFossilTaskCallback<{ name: string }>): Response<{ name: string }>;

   /**
    * Add config to local fossil instance for the specified `key` (eg: user.name) and value (eg: 'your name').
    * Set `append` to true to append to rather than overwrite the key
    */
   addConfig(key: string, value: string, global?: boolean, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   addConfig(key: string, value: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Delete config to local fossil instance for the specified `key` (eg: user.name) and value (eg: 'your name').
    * Set `append` to true to append to rather than overwrite the key
    */
   deleteConfig(key: string, global?: boolean, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   deleteConfig(key: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

       
   /**
    * Configuration values visible to git in the current working directory
    */
   listConfig(callback?: types.SimpleFossilTaskCallback<resp.ConfigListSummary>): Response<resp.ConfigListSummary>;

   /**
    * Adds a remote to the list of remotes.
    *
    * - `remoteName` Name of the repository - eg "upstream"
    * - `remoteRepo` Fully qualified SSH or HTTP(S) path to the remote repo
    * - `options` Optional additional settings permitted by the `git remote add` command, merged into the command prior to the repo name and remote url
    */
   addRemote(remoteName: string, remoteRepo: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   addRemote(remoteName: string, remoteRepo: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Add a lightweight tag to the head of the current branch
    */
   addTag(name: string, callback?: types.SimpleFossilTaskCallback<{ name: string }>): Response<{ name: string }>;

   /**
    * Equivalent to `catFile` but will return the native `Buffer` of content from the git command's stdout.
    */
   binaryCatFile(options: string[], callback?: types.SimpleFossilTaskCallback<any>): Response<any>;

   /**
    * List all branches
    */
   branch(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.BranchSummary>): Response<resp.BranchSummary>;

   /**
    * List of local branches
    */
   branchLocal(callback?: types.SimpleFossilTaskCallback<resp.BranchSummary>): Response<resp.BranchSummary>;

   /**
    * Returns a list of objects in a tree based on commit hash.
    * Passing in an object hash returns the object's content, size, and type.
    *
    * Passing "-p" will instruct cat-file to determine the object type, and display its formatted contents.
    *
    * @see https://git-scm.com/docs/git-cat-file
    */
   catFile(options: string[], callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   catFile(callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Checkout a tag or revision, any number of additional arguments can be passed to the `git checkout` command
    * by supplying either a string or array of strings as the `what` parameter.
    */
   checkout(what: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   checkout(what: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   checkout(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Checkout a remote branch.
    *
    * - branchName name of branch.
    * - startPoint (e.g origin/development).
    */
   checkoutBranch(branchName: string, startPoint: string, callback?: types.SimpleFossilTaskCallback<void>): Response<void>;

   /**
    * Internally uses pull and tags to get the list of tags then checks out the latest tag.
    */
   checkoutLatestTag(branchName: string, startPoint: string, callback?: types.SimpleFossilTaskCallback<void>): Response<void>;

   /**
    * Checkout a local branch
    */
   checkoutLocalBranch(branchName: string, callback?: types.SimpleFossilTaskCallback<void>): Response<void>;

   /**
    * Deletes unwanted content from the local repo - when supplying the first argument as
    * an array of `CleanOptions`, the array must include one of `CleanOptions.FORCE` or
    * `CleanOptions.DRY_RUN`.
    *
    * eg:
    *
    * ```typescript
    await fossil.clean(CleanOptions.FORCE);
    await fossil.clean(CleanOptions.DRY_RUN + CleanOptions.RECURSIVE);
    await fossil.clean(CleanOptions.FORCE, ['./path']);
    await fossil.clean(CleanOptions.IGNORED + CleanOptions.FORCE, {'./path': null});
    * ```
    */
   clean(args: types.CleanOptions[], options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.CleanSummary>): Response<resp.CleanSummary>;

   clean(mode: types.CleanMode | string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.CleanSummary>): Response<resp.CleanSummary>;

   clean(mode: types.CleanMode | string, callback?: types.SimpleFossilTaskCallback<resp.CleanSummary>): Response<resp.CleanSummary>;

   clean(options?: types.TaskOptions): Response<resp.CleanSummary>;

   clean(callback?: types.SimpleFossilTaskCallback<resp.CleanSummary>): Response<resp.CleanSummary>;

   /**
    * Clears the queue of pending commands and returns the wrapper instance for chaining.
    */
   clearQueue(): this;

   /**
    * Clone a repository into a new directory.
    *
    * - repoPath repository url to clone e.g. https://github.com/steveukx/git-js.git
    * -  localPath local folder path to clone to.
    * - options supported by [git](https://git-scm.com/docs/git-clone).
    */
   clone(repoPath: string, localPath: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   clone(repoPath: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Open a fossil repo file
    */
   open(repoPath: string, localPath: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback): Response<string>;

   open(repoPath: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback): Response<string>;

       
   /**
    * Commits changes in the current working directory - when specific file paths are supplied, only changes on those
    * files will be committed.
    */
   commit(
      message: string | string[],
      files?: string | string[],
      options?: types.Options,
      callback?: types.SimpleFossilTaskCallback<resp.CommitResult>): Response<resp.CommitResult>;

   commit(
      message: string | string[],
      options?: types.TaskOptions,
      callback?: types.SimpleFossilTaskCallback<resp.CommitResult>): Response<resp.CommitResult>;

   commit(
      message: string | string[],
      files?: string | string[],
      callback?: types.SimpleFossilTaskCallback<resp.CommitResult>): Response<resp.CommitResult>;

   commit(
      message: string | string[],
      callback?: types.SimpleFossilTaskCallback<resp.CommitResult>): Response<resp.CommitResult>;

   /**
    * Sets the path to a custom git binary, should either be `git` when there is an installation of git available on
    * the system path, or a fully qualified path to the executable.
    */
   customBinary(command: string): this;

   /**
    * Delete one local branch. Supply the branchName as a string to return a
    * single `BranchDeletionSummary` instances.
    *
    * - branchName name of branch
    * - forceDelete (optional, defaults to false) set to true to forcibly delete unmerged branches
    */
   deleteLocalBranch(branchName: string, forceDelete?: boolean, callback?: types.SimpleFossilTaskCallback<resp.BranchSingleDeleteResult>): Response<resp.BranchSingleDeleteResult>;

   deleteLocalBranch(branchName: string, callback?: types.SimpleFossilTaskCallback<resp.BranchSingleDeleteResult>): Response<resp.BranchSingleDeleteResult>;

   /**
    * Get the diff of the current repo compared to the last commit with a set of options supplied as a string.
    */
   diff(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Gets a summary of the diff for files in the repo, uses the `git diff --stat` format to calculate changes.
    *
    * in order to get staged (only): `--cached` or `--staged`.
    */
   diffSummary(command: string | number, options: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.DiffResult>): Response<resp.DiffResult>;

   diffSummary(command: string | number, callback?: types.SimpleFossilTaskCallback<resp.DiffResult>): Response<resp.DiffResult>;

   diffSummary(options: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.DiffResult>): Response<resp.DiffResult>;

   diffSummary(callback?: types.SimpleFossilTaskCallback<resp.DiffResult>): Response<resp.DiffResult>;

   /**
    * Sets an environment variable for the spawned child process, either supply both a name and value as strings or
    * a single object to entirely replace the current environment variables.
    *
    * @param {string|Object} name
    * @param {string} [value]
    */
   env(name: string, value: string): this;

   env(env: object): this;

   /**
    * Updates the local working copy database with changes from the default remote repo and branch.
    */
   sync(remote: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   sync(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   sync(callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Gets the currently available remotes, setting the optional verbose argument to true includes additional
    * detail on the remotes themselves.
    */
   getRemotes(callback?: types.SimpleFossilTaskCallback<types.RemoteWithoutRefs[]>): Response<types.RemoteWithoutRefs[]>;

   /**
    * Initialize a fossil repo file
    */
   init(path: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.InitResult>): Response<resp.InitResult>;

   init(path: string, callback?: types.SimpleFossilTaskCallback<resp.InitResult>): Response<resp.InitResult>;

   /**
    * Show commit logs from `HEAD` to the first commit.
    * If provided between `options.from` and `options.to` tags or branch.
    *
    * You can provide `options.file`, which is the path to a file in your repository. Then only this file will be considered.
    *
    * To use a custom splitter in the log format, set `options.splitter` to be the string the log should be split on.
    *
    * By default the following fields will be part of the result:
    *   `hash`: full commit hash
    *   `date`: author date, ISO 8601-like format
    *   `message`: subject + ref names, like the --decorate option of git-log
    *   `author_name`: author name
    *   `author_email`: author mail
    * You can specify `options.format` to be an mapping from key to a format option like `%H` (for commit hash).
    * The fields specified in `options.format` will be the fields in the result.
    *
    * Options can also be supplied as a standard options object for adding custom properties supported by the git log command.
    * For any other set of options, supply options as an array of strings to be appended to the git log command.
    *
    * @returns Response<ListLogSummary>
    *
    * @see https://git-scm.com/docs/git-log
    */
   log<T = types.DefaultLogFields>(options?: types.TaskOptions | types.LogOptions<T>, callback?: types.SimpleFossilTaskCallback<resp.LogResult<T>>): Response<resp.LogResult<T>>;

   /**
    * Runs a merge, `options` can be either an array of arguments
    * supported by the [`git merge`](https://git-scm.com/docs/git-merge)
    * or an options object.
    *
    * Conflicts during the merge result in an error response,
    * the response type whether it was an error or success will be a MergeSummary instance.
    * When successful, the MergeSummary has all detail from a the PullSummary
    *
    * @see https://github.com/steveukx/git-js/blob/master/src/responses/MergeSummary.js
    * @see https://github.com/steveukx/git-js/blob/master/src/responses/PullSummary.js
    */
   merge(options: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.MergeResult>): Response<resp.MergeResult>;

   /**
    * Merges from one branch to another, equivalent to running `git merge ${from} $[to}`, the `options` argument can
    * either be an array of additional parameters to pass to the command or null / omitted to be ignored.
    *
    * - from branch to merge from.
    * - to branch to merge to.
    */
   mergeFromTo<E extends FossilError>(from: string, to: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.MergeResult, E>): Response<resp.MergeResult>;

   mergeFromTo<E extends FossilError>(from: string, to: string, callback?: types.SimpleFossilTaskCallback<resp.MergeResult, E>): Response<resp.MergeResult>;

   /**
    * Moves one or more files to a new destination.
    *
    * @see https://git-scm.com/docs/git-mv
    */
   mv(from: string | string[], to: string, callback?: types.SimpleFossilTaskCallback<resp.MoveSummary>): Response<resp.MoveSummary>;

   /**
    * Sets a handler function to be called whenever a new child process is created, the handler function will be called
    * with the name of the command being run and the stdout & stderr streams used by the ChildProcess.
    *
    * @example
    * require('simple-fossil')
    *    .outputHandler(function (command, stdout, stderr) {
    *       stdout.pipe(process.stdout);
    *    })
    *    .checkout('https://github.com/user/repo.git');
    *
    * @see https://nodejs.org/api/child_process.html#child_process_class_childprocess
    * @see https://nodejs.org/api/stream.html#stream_class_stream_readable
    */
   outputHandler(handler: types.outputHandler | void): this;

   /**
    * Fetch from and integrate with another repository or a local branch.
    */
   pull(remote?: string, branch?: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.PullResult>): Response<resp.PullResult>;

   pull(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.PullResult>): Response<resp.PullResult>;

   pull(callback?: types.SimpleFossilTaskCallback<resp.PullResult>): Response<resp.PullResult>;

   /**
    * Executes any command against the git binary.
    */
   raw(commands: string | string[] | types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   raw(options: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   raw(...commands: string[]): Response<string>;

   // leading varargs with trailing options/callback
   raw(a: string, options: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   raw(a: string, b: string, options: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   raw(a: string, b: string, c: string, options: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   raw(a: string, b: string, c: string, d: string, options: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   raw(a: string, b: string, c: string, d: string, e: string, options: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   // leading varargs with trailing callback
   raw(a: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   raw(a: string, b: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   raw(a: string, b: string, c: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   raw(a: string, b: string, c: string, d: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   raw(a: string, b: string, c: string, d: string, e: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Rebases the current working copy. Options can be supplied either as an array of string parameters
    * to be sent to the `git rebase` command, or a standard options object.
    */
   rebase(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   rebase(callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Call any `fossil remote` function with arguments passed as an array of strings.
    */
   remote(options: string[], callback?: types.SimpleFossilTaskCallback<void | string>): Response<void | string>;

   /**
    * Removes an entry from the list of remotes.
    *
    * - remoteName Name of the repository - eg "upstream"
    */
   deleteRemote(remoteName: string, callback?: types.SimpleFossilTaskCallback<void>): Response<void>;

   /**
    * Reset a repo. Called without arguments this is a soft reset for the whole repo,
    * for explicitly setting the reset mode, supply the first argument as one of the
    * supported reset modes.
    *
    * Trailing options argument can be either a string array, or an extension of the
    * ResetOptions, use this argument for supplying arbitrary additional arguments,
    * such as restricting the pathspec.
    *
    * ```typescript
    // equivalent to each other
    simpleFossil().reset(ResetMode.HARD, ['--', 'my-file.txt']);
    simpleFossil().reset(['--hard', '--', 'my-file.txt']);
    simpleFossil().reset(ResetMode.HARD, {'--': null, 'my-file.txt': null});
    simpleFossil().reset({'--hard': null, '--': null, 'my-file.txt': null});
    ```
    */
   reset(mode: types.ResetMode, options?: types.TaskOptions<types.ResetOptions>, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   reset(mode: types.ResetMode, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   reset(options?: types.TaskOptions<types.ResetOptions>, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Revert one or more commits in the local working copy
    *
    * - commit The commit to revert. Can be any hash, offset (eg: `HEAD~2`) or range (eg: `master~5..master~2`)
    */
   revert(commit: String, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<void>): Response<void>;

   revert(commit: String, callback?: types.SimpleFossilTaskCallback<void>): Response<void>;

   /**
    * Passes the supplied options to `git rev-parse` and returns the string response. Options can be either a
    * string array or `Options` object of options compatible with the [rev-parse](https://git-scm.com/docs/git-rev-parse)
    *
    * Example uses of `rev-parse` include converting friendly commit references (ie: branch names) to SHA1 hashes
    * and retrieving meta details about the current repo (eg: the root directory, and whether it was created as
    * a bare repo).
    */
   revparse(option: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   revparse(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Removes the named files from source control.
    */
   rm(paths: string | string[], callback?: types.SimpleFossilTaskCallback<void>): Response<void>;

   /**
    * Removes the named files from source control but keeps them on disk rather than deleting them entirely. To
    * completely remove the files, use `rm`.
    */
   rmKeepLocal(paths: string | string[], callback?: types.SimpleFossilTaskCallback<void>): Response<void>;

   /**
    * Show various types of objects, for example the file at a certain commit
    */
   show(option: string | types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   show(callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * @deprecated
    *
    * From version 2.7.0, use of `silent` is deprecated in favour of using the `debug` library, this method will
    * be removed in version 3.x.
    *
    * Please see the [readme](https://github.com/steveukx/git-js/blob/master/readme.md#enable-logging) for more details.
    *
    * Disables/enables the use of the console for printing warnings and errors, by default messages are not shown in
    * a production environment.
    *
    * @param {boolean} silence
    */
   silent(silence?: boolean): this;

   /**
    * Stash the local repo
    */
   stash(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   stash(callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * List the stash(s) of the local repo
    */
   stashList(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.LogResult>): Response<resp.LogResult>;

   stashList(callback?: types.SimpleFossilTaskCallback<resp.LogResult>): Response<resp.LogResult>;

   /**
    * Show the working tree status.
    */
   status(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.StatusResult>): Response<resp.StatusResult>;

   status(callback?: types.SimpleFossilTaskCallback<resp.StatusResult>): Response<resp.StatusResult>;

   /**
    * Call any `git submodule` function with arguments passed as an array of strings.
    */
   subModule(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Add a submodule
    */
   submoduleAdd(repo: string, path: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Initialise submodules
    */
   submoduleInit(moduleName: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   submoduleInit(moduleName: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   submoduleInit(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   submoduleInit(callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Update submodules
    */
   submoduleUpdate(moduleName: string, options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   submoduleUpdate(moduleName: string, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   submoduleUpdate(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   submoduleUpdate(callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * List all tags. When using git 2.7.0 or above, include an options object with `"--sort": "property-name"` to
    * sort the tags by that property instead of using the default semantic versioning sort.
    *
    * Note, supplying this option when it is not supported by your Fossil version will cause the operation to fail.
    */
   tag(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<string>): Response<string>;

   /**
    * Gets a list of tagged versions.
    */
   tags(options?: types.TaskOptions, callback?: types.SimpleFossilTaskCallback<resp.TagResult>): Response<resp.TagResult>;

   tags(callback?: types.SimpleFossilTaskCallback<resp.TagResult>): Response<resp.TagResult>;

   /**
    * Updates repository server info
    */
   updateServerInfo(callback?: types.SimpleFossilTaskCallback<string>): Response<string>;
}
