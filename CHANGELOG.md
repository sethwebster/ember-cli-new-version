# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.0.0](https://github.com/sethwebster/ember-cli-new-version/compare/v3.0.0...v4.0.0) (2021-12-15)


### ⚠ BREAKING CHANGES

* The version file is always created, you must opt out now instead of opt in, see the README

The way to opt out of this behavior is to include a VERSION.txt in the
app, otherwise the file will be created automatically. When a
VERSION.txt file exists the treeForPublic build step won't overwrite it.

Co-authored-by: Ilya Radchenko <knownasilya@gmail.com>
* config options come from a new place, see the readme

### Features

* Always create the version file ([da01a6f](https://github.com/sethwebster/ember-cli-new-version/commit/da01a6f5c19f6cf2fc37f9c45d522d7f3824c507))


### Bug Fixes

* Do configuration during build ([2fe8486](https://github.com/sethwebster/ember-cli-new-version/commit/2fe8486cf55fd6ce07309f1f772b77a042df10fc))

## [3.0.0](https://github.com/sethwebster/ember-cli-new-version/compare/v2.0.2...v3.0.0) (2021-11-24)


### ⚠ BREAKING CHANGES

* Drop Node < 12
* Drop Ember.js < 3.20 and CLI < 3.20
* use GC for notifier

* fix: update waitFor

* fix: update deps
* introduces a new version service. Some arguments from the components have been moved here and other moved to the configuration.
* How the version check happens has also changed, see https://github.com/sethwebster/ember-cli-new-version/pull/94

* Enable JS code checking

* Extract new version fetching and checking from the NewVersionNotifier component in a service

The logic is now in a service so that it can be used independently of the action.

There are slight behaviour changes and new behaviours as well.

The service contains an observable `isNewVersionAvailable` property.
This property is set to true when a new version is available.

The version checking is slightly different: before, the first check was ignored because the component was comparing the previously fetched version and the latest fetched version.
Now, the version is always checked against the version provided in environment.js. This thus means the comparison is always done against the compiled version of the app.

The component had a way to ignore a version, by setting the next version to check to the latest fetched version. To keep the compatibility with this behaviour, there is now an explicit list of "ignore versions" in the service, populated when the user closes the `NewVersionNotifier`. Note that this list is kept in memory only and when the user reloads the page, the list is empty again. This is the same behaviour as before.

I kept the code related to testing in the service to limit the changes, but this could be moved in the TestNewVersionService implementation so that the original NewVersionService is kept clean of testing behaviour.

The onNewVersion action still exists but is now in the service. If one needs this callback, he/she can overload the NewVersionService and override onNewVersion. Same thing for onError.

Some properties that were arguments of the component have been moved to the configuration.

* Fix dependencies declaration

Some addon dependencies were declared in devDependencies while they are needed by the addon to run.

* Make MAX_COUNT_IN_TESTING a configuration variable

This let tests override this option as needed.

* fix: keep the initial slash for fetching VERSION.txt

Before this commit, the fetch of VERSION.txt with a default configuration would result to calling "VERSION.txt", which means "fetch the file relative to the current page URL".

This may lead to issue in production, but leads to issues in some tests situation when using `ember test` where the full path to VERSION.txt is resolved to `/VERSION.txt` when declaring it in tests, while it is resolved to `http://localhost:7357/some-random-numbers/tests/VERSION.txt` when fetching the file.

This commit fixes the issue by not removing the `/` in front of VERSION.txt.

This fixes the isse for my scenarios; but I am not sure why there was this check and removal of the `/` in the first place, this thus may lead to breaking changes for some.

Co-authored-by: Ilya Radchenko <knownasilya@gmail.com>
* introduces a new version service. Some arguments from the components have been moved here and other moved to the configuration.
* How the version check happens has also changed, see https://github.com/sethwebster/ember-cli-new-version/pull/94

* Enable JS code checking

* Extract new version fetching and checking from the NewVersionNotifier component in a service

The logic is now in a service so that it can be used independently of the action.

There are slight behaviour changes and new behaviours as well.

The service contains an observable `isNewVersionAvailable` property.
This property is set to true when a new version is available.

The version checking is slightly different: before, the first check was ignored because the component was comparing the previously fetched version and the latest fetched version.
Now, the version is always checked against the version provided in environment.js. This thus means the comparison is always done against the compiled version of the app.

The component had a way to ignore a version, by setting the next version to check to the latest fetched version. To keep the compatibility with this behaviour, there is now an explicit list of "ignore versions" in the service, populated when the user closes the `NewVersionNotifier`. Note that this list is kept in memory only and when the user reloads the page, the list is empty again. This is the same behaviour as before.

I kept the code related to testing in the service to limit the changes, but this could be moved in the TestNewVersionService implementation so that the original NewVersionService is kept clean of testing behaviour.

The onNewVersion action still exists but is now in the service. If one needs this callback, he/she can overload the NewVersionService and override onNewVersion. Same thing for onError.

Some properties that were arguments of the component have been moved to the configuration.

* Fix dependencies declaration

Some addon dependencies were declared in devDependencies while they are needed by the addon to run.
* use GC for notifier
* Drop ember-concurrency < v1, update Ember deps.
* Drop Ember < 3.16 (might still work, but untested going forward)
* Drop Node < 10

### Features

* Extract new version fetching and checking from the NewVersionNotifier component in a service ([#94](https://github.com/sethwebster/ember-cli-new-version/issues/94)) ([83c3528](https://github.com/sethwebster/ember-cli-new-version/commit/83c35280e847aa27a831334ff55ed29424396df4))
* Make MAX_COUNT_IN_TESTING a configuration variable ([#95](https://github.com/sethwebster/ember-cli-new-version/issues/95)) ([ba20169](https://github.com/sethwebster/ember-cli-new-version/commit/ba20169a58551b7e775aefb7b3c25e8a445981d2))


### Bug Fixes

* allow ec v1 as well ([32d086d](https://github.com/sethwebster/ember-cli-new-version/commit/32d086dfd9b5c3c60a376b311f297294c92a738c))
* Ember v3.22.0...v3.26.1 ([e27600c](https://github.com/sethwebster/ember-cli-new-version/commit/e27600ca18e78584831336ce52edef04657e5761))
* Fix tests & Upgrade ember concurrency to 2.0 ([#81](https://github.com/sethwebster/ember-cli-new-version/issues/81)) ([5e111b1](https://github.com/sethwebster/ember-cli-new-version/commit/5e111b1cd2775aa9c180c80845c003df23ed54fb))
* keep the initial slash for fetching VERSION.txt ([#99](https://github.com/sethwebster/ember-cli-new-version/issues/99)) ([1daf826](https://github.com/sethwebster/ember-cli-new-version/commit/1daf826874dc166e15d94258f399f7fc2ce6c0c3)), closes [#94](https://github.com/sethwebster/ember-cli-new-version/issues/94)
* regenerator v1 ([22bde5d](https://github.com/sethwebster/ember-cli-new-version/commit/22bde5d3e39fee99da163cb280d6ac78fd6f2ee5))
* update dep path and lockfile ([f446068](https://github.com/sethwebster/ember-cli-new-version/commit/f446068b9b1a05fd1a3e3a01bfd21ee44eee3189))
* update deps ([0fa7890](https://github.com/sethwebster/ember-cli-new-version/commit/0fa7890d1fe5a8d42dba711550c11ae11787cc15))
* update to glimmer component ([9b2abb7](https://github.com/sethwebster/ember-cli-new-version/commit/9b2abb7e7e2fd8ee76a95da83d8f540307220c3d))
* update waitFor ([244011e](https://github.com/sethwebster/ember-cli-new-version/commit/244011eecc4cbec02e6edde9888c5143bb981f0f))
* Upgrade v3.11.0...v3.22.0 ([3ecab5c](https://github.com/sethwebster/ember-cli-new-version/commit/3ecab5c358aa403d398ba42b4fb5cbed53924f91))
* use https version of import regen dep for ci ([1b8adc3](https://github.com/sethwebster/ember-cli-new-version/commit/1b8adc3c31b5e281edfc47ad37dea9bb9ce76930))
* use node 14 in tests and pin volta ([43d98f0](https://github.com/sethwebster/ember-cli-new-version/commit/43d98f0cc5594e01916062cfc297ba888e5557ea))
* v3.26.1...v3.28.4 ([9722fdf](https://github.com/sethwebster/ember-cli-new-version/commit/9722fdff976a7fbac3f201bf9c898b64f94c5a33))

### [2.0.2](https://github.com/sethwebster/ember-cli-new-version/compare/v2.0.1...v2.0.2) (2020-11-11)


### Bug Fixes

* default update message dynamic values ([22f9bb9](https://github.com/sethwebster/ember-cli-new-version/commit/22f9bb939df4f8960c986ae1a570570079c1cc41)), closes [#64](https://github.com/sethwebster/ember-cli-new-version/issues/64)

<a name="2.0.1"></a>
## [2.0.1](https://github.com/sethwebster/ember-cli-new-version/compare/v2.0.0...v2.0.1) (2019-09-30)


### Bug Fixes

* security update for deps ([e7bf1af](https://github.com/sethwebster/ember-cli-new-version/commit/e7bf1af))
* Update ember-concurrency for Ember 3.13+ ([#62](https://github.com/sethwebster/ember-cli-new-version/issues/62)) ([c22a6f5](https://github.com/sethwebster/ember-cli-new-version/commit/c22a6f5))
* update more deps ([f79e6c2](https://github.com/sethwebster/ember-cli-new-version/commit/f79e6c2))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/sethwebster/ember-cli-new-version/compare/v1.6.0...v2.0.0) (2019-08-06)


### Bug Fixes

* add v1 to concurrency dep ([27511bb](https://github.com/sethwebster/ember-cli-new-version/commit/27511bb)), closes [#60](https://github.com/sethwebster/ember-cli-new-version/issues/60)
* don't use double curlies for version updateMessage vars ([1269833](https://github.com/sethwebster/ember-cli-new-version/commit/1269833))
* drop node 6 and test Ember 3.4+ ([7253281](https://github.com/sethwebster/ember-cli-new-version/commit/7253281))


### BREAKING CHANGES

* `@updateMessage` now takes `{oldVersion}` and `{newVersion}` instead of `{{oldVersion}}` to `{{newVersion}}` since curlies can be used in strings in hbs and with angle bracket syntax you are far more likely to write strings like that.
* Drop node 6 support and Ember < 3.4

Might still work on <3.4 but untested



<a name="1.6.0"></a>
# [1.6.0](https://github.com/sethwebster/ember-cli-new-version/compare/v1.5.0...v1.6.0) (2019-08-06)


### Bug Fixes

* **security:** fix audit vulnerabilities ([65d2821](https://github.com/sethwebster/ember-cli-new-version/commit/65d2821))


### Features

* allow to set initial delay for first check and disable in fastboot mode ([#61](https://github.com/sethwebster/ember-cli-new-version/issues/61)) ([a650b3d](https://github.com/sethwebster/ember-cli-new-version/commit/a650b3d))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/sethwebster/ember-cli-new-version/compare/v1.4.4...v1.5.0) (2019-05-03)


### Features

* Allow custom version comparison function ([#57](https://github.com/sethwebster/ember-cli-new-version/issues/57)) ([9b0207d](https://github.com/sethwebster/ember-cli-new-version/commit/9b0207d))



<a name="1.4.4"></a>
## [1.4.4](https://github.com/sethwebster/ember-cli-new-version/compare/v1.4.3...v1.4.4) (2019-03-26)


### Bug Fixes

* Update ember-concurrency to the latest version ([#56](https://github.com/sethwebster/ember-cli-new-version/issues/56)) ([53ded44](https://github.com/sethwebster/ember-cli-new-version/commit/53ded44))



<a name="1.4.3"></a>
## [1.4.3](https://github.com/sethwebster/ember-cli-new-version/compare/v1.4.2...v1.4.3) (2019-01-09)


### Bug Fixes

* add ember-fetch via a default blueprint instead ([78d97d5](https://github.com/sethwebster/ember-cli-new-version/commit/78d97d5))
* call super in included ([9ab9941](https://github.com/sethwebster/ember-cli-new-version/commit/9ab9941))



<a name="1.4.2"></a>
## [1.4.2](https://github.com/sethwebster/ember-cli-new-version/compare/v1.4.1...v1.4.2) (2019-01-05)


### Bug Fixes

* **lint:** quotes in template ([8dc5c94](https://github.com/sethwebster/ember-cli-new-version/commit/8dc5c94))
* concurrency updated to fix https://github.com/machty/ember-concurrency/issues/261 ([ede4be3](https://github.com/sethwebster/ember-cli-new-version/commit/ede4be3))
* run codemods, update tests ([b076032](https://github.com/sethwebster/ember-cli-new-version/commit/b076032))
* update using ember-cli-update ([0ca640e](https://github.com/sethwebster/ember-cli-new-version/commit/0ca640e))



<a name="1.4.1"></a>
## [1.4.1](https://github.com/sethwebster/ember-cli-new-version/compare/v1.4.0...v1.4.1) (2019-01-04)


### Bug Fixes

* replace ember-ajax with ember-fetch ([#54](https://github.com/sethwebster/ember-cli-new-version/issues/54)) ([5e1c79c](https://github.com/sethwebster/ember-cli-new-version/commit/5e1c79c))
* update deps and move ember-fetch to dep ([99c1c6e](https://github.com/sethwebster/ember-cli-new-version/commit/99c1c6e))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/sethwebster/ember-cli-new-version/compare/v1.3.1...v1.4.0) (2018-09-28)


### Features

* Add an 'onError' handler that can be used to do something in response to a server error ([#51](https://github.com/sethwebster/ember-cli-new-version/issues/51)) ([1a491c9](https://github.com/sethwebster/ember-cli-new-version/commit/1a491c9))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/sethwebster/ember-cli-new-version/compare/v1.3.0...v1.3.1) (2018-08-11)


### Bug Fixes

* Log exceptions instead of throwing them ([#50](https://github.com/sethwebster/ember-cli-new-version/issues/50)) ([46e009b](https://github.com/sethwebster/ember-cli-new-version/commit/46e009b))
