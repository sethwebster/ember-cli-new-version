/*eslint no-console: ["error", { allow: ["log"] }] */
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';
import { later } from '@ember/runloop';
import layout from './template';

let taskRunCounter = 0;

const MAX_COUNT_IN_TESTING = 10;
const ONE_MINUTE = 60000;

export default Component.extend({
  layout: layout,
  tagName: '',

  enableInTests: false,
  updateInterval: ONE_MINUTE,
  firstCheckInterval: 0,
  versionFileName: '/VERSION.txt',
  updateMessage:
    'This application has been updated from version {oldVersion} to {newVersion}. Please save any work, then refresh browser to see changes.',
  showReload: true,
  reloadButtonText: 'Reload',
  onNewVersion(/* version, lastVersion */) {},
  onError(e) {
    if (!Ember.testing) {
      console.log(e);
    }
  },

  // internal state:
  lastVersion: null,
  version: null,

  _fastboot: computed(function () {
    let owner = getOwner(this);
    return owner.lookup('service:fastboot');
  }),

  url: computed('versionFileName', function () {
    const config = getOwner(this).resolveRegistration('config:environment');
    const versionFileName =
      get(config, 'newVersion.fileName') || this.versionFileName;
    const baseUrl =
      get(config, 'newVersion.prepend') || config.rootURL || config.baseURL;

    if (!config || baseUrl === '/') {
      return versionFileName;
    }

    return baseUrl + versionFileName;
  }).readOnly(),

  init() {
    this._super(...arguments);

    if (this.get('_fastboot.isFastBoot')) {
      return;
    }

    if (Ember.testing) {
      taskRunCounter = 0;
    }

    if (!Ember.testing || this.enableInTests) {
      if (this.firstCheckInterval > 0) {
        later(
          this,
          () => {
            this.updateVersion.perform();
          },
          this.firstCheckInterval
        );
      } else {
        this.updateVersion.perform();
      }
    }
  },

  updateIntervalWithTesting: computed(
    'updateInterval',
    'enableInTests',
    function () {
      let enableInTests = this.enableInTests;
      return !enableInTests && Ember.testing ? 0 : this.updateInterval;
    }
  ),

  updateVersion: task(function* () {
    const url = this.url;

    try {
      yield fetch(url + '?_=' + Date.now())
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
          return response.text();
        })
        .then((res) => {
          const currentVersion = this.version;
          const newVersion = res && res.trim();

          if (this.updateNeeded(currentVersion, newVersion)) {
            const message = this.updateMessage
              .replace('{oldVersion}', currentVersion)
              .replace('{newVersion}', newVersion);

            this.setProperties({
              message,
              lastVersion: currentVersion,
            });
            this.onNewVersion(newVersion, currentVersion);
          }

          this.set('version', newVersion);
        });
    } catch (e) {
      this.onError(e);
    } finally {
      let updateInterval = this.updateIntervalWithTesting;
      if (updateInterval === null || updateInterval === undefined) {
        updateInterval = ONE_MINUTE;
      }

      yield timeout(updateInterval);

      if (Ember.testing && ++taskRunCounter > MAX_COUNT_IN_TESTING) {
        return;
      }

      if (Ember.testing && !this.enableInTests) {
        return;
      }
      this.updateVersion.perform();
    }
  }),

  updateNeeded(currentVersion, newVersion) {
    return currentVersion && newVersion !== currentVersion;
  },

  actions: {
    reload() {
      if (typeof window !== 'undefined' && window.location) {
        window.location.reload(true);
      }
    },

    close() {
      this.set('message', undefined);
    },
  },
});
