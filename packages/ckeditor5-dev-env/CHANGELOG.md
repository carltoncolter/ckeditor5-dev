Changelog
=========

## [8.0.5](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@8.0.4...@ckeditor/ckeditor5-dev-env@8.0.5) (2018-01-22)

### Bug fixes

* Translation utils will now add correct license headers. ([c054c17](https://github.com/ckeditor/ckeditor5-dev/commit/c054c17))


## [8.0.4](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@8.0.0...@ckeditor/ckeditor5-dev-env@8.0.4) (2017-12-20)

### Bug fixes

* Additional notes will be removed from commit's footer. Closes [#341](https://github.com/ckeditor/ckeditor5-dev/issues/341). ([95bcfd8](https://github.com/ckeditor/ckeditor5-dev/commit/95bcfd8))


## [8.0.0](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@7.0.1...@ckeditor/ckeditor5-dev-env@8.0.0) (2017-11-30)

### Features

* `TranslationService` v2. Closes [ckeditor/ckeditor5#666](https://github.com/ckeditor/ckeditor5/issues/666). Closes [ckeditor/ckeditor5#624](https://github.com/ckeditor/ckeditor5/issues/624). ([ee2a1d2](https://github.com/ckeditor/ckeditor5-dev/commit/ee2a1d2))


## [7.0.1](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@7.0.0...@ckeditor/ckeditor5-dev-env@7.0.1) (2017-11-28)

### Bug fixes

* Additional tags for continuous integration services used in commit message will be removed during generating the changelog. Closes [#309](https://github.com/ckeditor/ckeditor5-dev/issues/309). ([600f36e](https://github.com/ckeditor/ckeditor5-dev/commit/600f36e))
* Changelog generator for internal releases will always add two blank lines. Closes [#308](https://github.com/ckeditor/ckeditor5-dev/issues/308). ([b7b5453](https://github.com/ckeditor/ckeditor5-dev/commit/b7b5453))
* Links to releases will be generated correctly. Closes [#310](https://github.com/ckeditor/ckeditor5-dev/issues/310). ([5f98f9e](https://github.com/ckeditor/ckeditor5-dev/commit/5f98f9e))


## [7.0.0](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@6.0.0...@ckeditor/ckeditor5-dev-env@7.0.0) (2017-11-13)

### Other changes

* Removed gulp dependency across the whole project. Closes [#296](https://github.com/ckeditor/ckeditor5-dev/issues/296). ([723bee5](https://github.com/ckeditor/ckeditor5-dev/commit/723bee5))

  Now all packages use only npm scripts. Depending on usage you might either create a `"script"` entry in `pacakge.json` to invoke bin executables or require the library into a script.

  * Package `ckeditor5-dev-env` exposes new `translations` binary.
  * Package `ckeditor5-dev-tests` exposes new `test:manual` binary.
  * Removed `gulp-jsdoc3` from `ckeditor5-dev-docs`. Now `jsdoc` is invoked directly.
  * Removed `options` param from logger methods. Logger no longer uses `gutil.log` method.

### BREAKING CHANGES

* Gulp tasks were removed. New npm scripts were introduced.


## [6.0.0](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.1.13...@ckeditor/ckeditor5-dev-env@6.0.0) (2017-11-10)

### Features

* Introduced a task which allows generating a summary changelog for a repository. Closes [#289](https://github.com/ckeditor/ckeditor5-dev/issues/289). ([eaf76b4](https://github.com/ckeditor/ckeditor5-dev/commit/eaf76b4))

### BREAKING CHANGES

* Release tool won't generate changelogs for skipped packages anymore. This task will be handled by changelog generator.

### NOTE

* The changelog generator will propose `internal` bump version instead of `skip` if a package contains any commit.
* If a package does not contain any commit, the changelog will propose `skip` bump version.
* `internal` bump will increase the release version if the current version is specified as a release (`v1.0.0-alpha.1` becomes `v1.0.0-alpha.2`).


## [5.1.13](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.1.12...@ckeditor/ckeditor5-dev-env@5.1.13) (2017-10-20)

### Bug fixes

* Changed order of commands executed by the release tool to optimize the time it takes from the first published package to the last. Closes [#272](https://github.com/ckeditor/ckeditor5-dev/issues/272). Closes [#292](https://github.com/ckeditor/ckeditor5-dev/issues/292). ([451ff8c](https://github.com/ckeditor/ckeditor5-dev/commit/451ff8c))

  Due to releasing packages one after another, the builds on CI might break and users' `npm install` commands might fail too. Now release tool will:

  * do all commits (generate missing changelogs or/and  update dependencies' versions),
  * publish all packages on NPM (all packages will contain proper versions),
  * do all pushes (CI will not crash because all versions are valid),
  * make the GitHub releases.

  This will ensure that the process takes minimum amount of time.

### Other changes

* Changed order of headers in generated changelog. Closes [#293](https://github.com/ckeditor/ckeditor5-dev/issues/293). ([ad660b4](https://github.com/ckeditor/ckeditor5-dev/commit/ad660b4))


## [5.1.12](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.1.10...@ckeditor/ckeditor5-dev-env@5.1.12) (2017-10-01)

### Bug fixes

* If a part of a commit message matches "organization/repository#id" it will be replaced with a link to an issue in that specific repository. Also, scoped package names won't be replaced with links to user profiles. Closes [#269](https://github.com/ckeditor/ckeditor5-dev/issues/269). ([e9bf324](https://github.com/ckeditor/ckeditor5-dev/commit/e9bf324))


## [5.1.10](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.1.8...@ckeditor/ckeditor5-dev-env@5.1.10) (2017-09-07)

### Bug fixes

* Merge commit which does not contain the second line will not crash the changelog tool. Closes [#276](https://github.com/ckeditor/ckeditor5-dev/issues/276). ([ab1ffd8](https://github.com/ckeditor/ckeditor5-dev/commit/ab1ffd8))
* Several issues related to proper typing the commit subject. Closes [#270](https://github.com/ckeditor/ckeditor5-dev/issues/270). Closes [#271](https://github.com/ckeditor/ckeditor5-dev/issues/271). ([0df891d](https://github.com/ckeditor/ckeditor5-dev/commit/0df891d))

  * If a commit message didn't end with a dot, it was ignored. Now it will be handled.
  * Added aliases for `Fix` type of the commit. Now `Fixes` and `Fixed` will be handled as `Fix`.
  * Merge commit which wasn't a pull request was ignored. Now it will be handled.


## [5.1.8](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.1.7...@ckeditor/ckeditor5-dev-env@5.1.8) (2017-09-01)

### Bug fixes

* Add better network error handling for downloading and uploading translations. Closes [#265](https://github.com/ckeditor/ckeditor5-dev/issues/265). ([c12fb15](https://github.com/ckeditor/ckeditor5-dev/commit/c12fb15))


## [5.1.7](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.1.5...@ckeditor/ckeditor5-dev-env@5.1.7) (2017-08-23)

### Bug fixes

* Fixed Transifex URL scheme. Closes [#249](https://github.com/ckeditor/ckeditor5-dev/issues/249). ([3276048](https://github.com/ckeditor/ckeditor5-dev/commit/3276048))


## [5.1.5](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.1.4...@ckeditor/ckeditor5-dev-env@5.1.5) (2017-08-16)

### Bug fixes

* "Publish" commits will not be parsed when generating the changelog. Closes [#220](https://github.com/ckeditor/ckeditor5-dev/issues/220). ([7501a6b](https://github.com/ckeditor/ckeditor5-dev/commit/7501a6b))
* `cli.confirmRelease()` shouldn't reject the promise if the user did not confirm the process. Closes [#245](https://github.com/ckeditor/ckeditor5-dev/issues/245). ([d57f9c8](https://github.com/ckeditor/ckeditor5-dev/commit/d57f9c8))


## [5.1.4](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.1.2...@ckeditor/ckeditor5-dev-env@5.1.4) (2017-08-09)

### Other changes

* The release process will now be error-proof by performing validation before starting taking any actions. Closes [#99](https://github.com/ckeditor/ckeditor5-dev/issues/99). Closes [#147](https://github.com/ckeditor/ckeditor5-dev/issues/147).  Closes: [#149](https://github.com/ckeditor/ckeditor5-dev/issues/149). Closes: [#151](https://github.com/ckeditor/ckeditor5-dev/issues/151). ([330a8dc](https://github.com/ckeditor/ckeditor5-dev/commit/330a8dc))


## [5.1.2](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.1.0...@ckeditor/ckeditor5-dev-env@5.1.2) (2017-06-14)

Internal changes only (updated dependencies, documentation, etc.).

## [5.1.0](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.0.1...@ckeditor/ckeditor5-dev-env@5.1.0) (2017-05-24)

### Bug fixes

* Changed the method for gathering files modified by a commit. Closes [#207](https://github.com/ckeditor/ckeditor5-dev/issues/207). ([cf79c4d](https://github.com/ckeditor/ckeditor5-dev/commit/cf79c4d))

### Features

* Added "internal" option to the version picker. Closes [#184](https://github.com/ckeditor/ckeditor5-dev/issues/184). ([ec43528](https://github.com/ckeditor/ckeditor5-dev/commit/ec43528))

  If you'll type "internal" as a new version during generating the changelog, all commits will be ignored when generating the changelog but the version will be bumped.

### Other changes

* Release tool will use `npm version` command for bumping the version. Closes [#213](https://github.com/ckeditor/ckeditor5-dev/issues/213). ([d72ccd4](https://github.com/ckeditor/ckeditor5-dev/commit/d72ccd4))

  It allows using the `preversion` and `postversion` npm hooks.


## [5.0.1](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@5.0.0...@ckeditor/ckeditor5-dev-env@5.0.1) (2017-05-16)

### Bug fixes

* Cached `pot` files will be cleaned before new ones are collected. Closes [#181](https://github.com/ckeditor/ckeditor5-dev/issues/181). ([da5b1f7](https://github.com/ckeditor/ckeditor5-dev/commit/da5b1f7))
* Changelog for internal changes will be followed by two blank lines instead of one. Closes [#188](https://github.com/ckeditor/ckeditor5-dev/issues/188). ([bb16c0d](https://github.com/ckeditor/ckeditor5-dev/commit/bb16c0d))
* Changelog utils won't throw an error if the changelog file does not exist. Closes [#187](https://github.com/ckeditor/ckeditor5-dev/issues/187). ([9b946fd](https://github.com/ckeditor/ckeditor5-dev/commit/9b946fd))
* Closed tickets should not be hoisted to the first line of a changelog item. Closes [#161](https://github.com/ckeditor/ckeditor5-dev/issues/161). ([bf8aa79](https://github.com/ckeditor/ckeditor5-dev/commit/bf8aa79))
* Complex, multiline commits will be parsed correctly. Closes [#146](https://github.com/ckeditor/ckeditor5-dev/issues/146). ([25c2d71](https://github.com/ckeditor/ckeditor5-dev/commit/25c2d71))


## [5.0.0](https://github.com/ckeditor/ckeditor5-dev/compare/@ckeditor/ckeditor5-dev-env@4.4.3...@ckeditor/ckeditor5-dev-env@5.0.0) (2017-04-27)

### Bug fixes

* The task for uploading translations will not throw anymore. Closes [#174](https://github.com/ckeditor/ckeditor5-dev/issues/174). ([a3b619d](https://github.com/ckeditor/ckeditor5-dev/commit/a3b619d))

### Features

* A task for generating changelogs in a monorepo was introduced. Several other improvements were made on the occasion. Closes [#148](https://github.com/ckeditor/ckeditor5-dev/issues/148). Closes [#121](https://github.com/ckeditor/ckeditor5-dev/issues/121). Closes [#110](https://github.com/ckeditor/ckeditor5-dev/issues/110). Closes [#96](https://github.com/ckeditor/ckeditor5-dev/issues/96). ([fefc1de](https://github.com/ckeditor/ckeditor5-dev/commit/fefc1de))

### BREAKING CHANGES

* Task `tasks.generateChangelog()` has been renamed to `tasks.generateChangelogForSinglePackage()`.
* Task `generateChangelogForDependencies()` has been renamed to `tasks.generateChangelogForSubRepositories()`.
* Task `tasks.createRelease()` has been renamed to `tasks.releaseRepository()`.
* Task `tasks.releaseDependencies()` has been renamed to `tasks.releaseSubRepositories()`.

### NOTE

* Introduced a new task – `tasks.generateChangelogForSubRepositories()`.


## 4.4.3

The big bang.
