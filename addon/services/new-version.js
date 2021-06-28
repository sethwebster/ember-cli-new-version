import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import { later } from '@ember/runloop';
import Service from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';

let taskRunCounter = 0;
const ONE_MINUTE = 60000;

/**
 * @typedef {object} Configuration
 * @property {string} versionFileName
 * @property {number} firstCheckInterval
 * @property {number} updateInterval
 * @property {boolean} enableInTests
 * @property {number} maxCountInTesting
 * @property {string} currentVersion
 */

export default class NewVersionService extends Service {
  get _fastboot() {
    let owner = getOwner(this);
    return owner.lookup('service:fastboot');
  }

  get _config() {
    return getOwner(this).resolveRegistration('config:environment');
  }

  /**
   * @type Configuration
   */
  get _newVersionConfig() {
    const defaultConfiguration = {
      versionFileName: 'VERSION.txt',
      firstCheckInterval: 0,
      updateInterval: 60000,
      enableInTests: false,
      maxCountInTesting: 10,
    };

    return Object.assign(defaultConfiguration, this._config.newVersion);
  }

  /**
   * @type {string}
   */
  get currentVersion() {
    // Users of the addon must set currentVersion.
    return this._newVersionConfig.currentVersion;
  }

  /**
   * @type {string | undefined}
   */
  @tracked latestVersion = undefined;

  ignoredVersions = A();

  /**
   * Templates can use this attribute to show or hide a proposition to reload the page.
   * This getter can be overriden to change the update strategy.
   *
   * By default, a new version is considered available when there is a difference
   * between the local version and the remote version.
   *
   * @returns {boolean} true if a new version is available.
   */
  get isNewVersionAvailable() {
    return (
      !this.ignoredVersions.includes(this.latestVersion) &&
      this.latestVersion &&
      this.currentVersion != this.latestVersion
    );
  }

  get url() {
    const versionFileName = this._newVersionConfig.versionFileName;
    const baseUrl =
      this._config.prepend || this._config.rootURL || this._config.baseURL;

    if (!this._config || baseUrl === '/') {
      return versionFileName;
    }

    return baseUrl + versionFileName;
  }

  get updateIntervalWithTesting() {
    let enableInTests = this._newVersionConfig.enableInTests;
    return !enableInTests && Ember.testing
      ? 0
      : this._newVersionConfig.updateInterval;
  }

  constructor() {
    super(...arguments);

    if (this._fastboot?.isFastBoot) {
      return;
    }

    // TODO: move the testing logic to a test version of the service
    if (Ember.testing) {
      taskRunCounter = 0;
    }

    if (!Ember.testing || this._newVersionConfig.enableInTests) {
      if (this._newVersionConfig.firstCheckInterval > 0) {
        later(
          this,
          () => {
            this.updateVersion.perform();
          },
          this._newVersionConfig.firstCheckInterval
        );
      } else {
        this.updateVersion.perform();
      }
    }
  }

  @task
  @waitFor
  *updateVersion() {
    const url = this.url;

    try {
      yield fetch(url + '?_=' + Date.now())
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
          return response.text();
        })
        .then((res) => {
          this.latestVersion = res ? res.trim() : undefined;

          // Call kept for compatibility with older version of the lib
          if (this.isNewVersionAvailable) {
            this.onNewVersion(
              this.latestVersion,
              this.ignoredVersions.lastObject || this.currentVersion
            );
          }
        });
    } catch (e) {
      this.onError(e);
    } finally {
      let updateInterval = this.updateIntervalWithTesting;
      if (updateInterval === null || updateInterval === undefined) {
        updateInterval = ONE_MINUTE;
      }

      yield timeout(updateInterval);

      if (
        Ember.testing &&
        ++taskRunCounter > this._newVersionConfig.maxCountInTesting
      ) {
        return;
      }

      if (Ember.testing && !this._newVersionConfig.enableInTests) {
        return;
      }
      this.updateVersion.perform();
    }
  }

  /**
   * Tells NewVersionService to ignore the given version.
   * If ignored, it won't trigger set `isNewVersionAvailable` to `true`.
   * The list of ignored is kept in memory only: if the site is reloaded, the list is empty.
   * @param {string} version
   */
  ignoreVersion(version) {
    this.ignoredVersions.push(version);
  }

  // eslint-disable-next-line no-unused-vars
  onNewVersion(newVersion, currentVersion) {
    // Kept for compatibility with older version of the lib
  }

  onError(error) {
    if (!Ember.testing) {
      console.log(error);
    }
  }
}
