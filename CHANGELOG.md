# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
