import { getOwner } from '@ember/application';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';
import { later } from '@ember/runloop';

let taskRunCounter = 0;

const MAX_COUNT_IN_TESTING = 10;
const ONE_MINUTE = 60000;

export default class NewVersionNotifier extends Component {
  @tracked enableInTests = this.args.enableInTests ?? false;
  @tracked updateInterval = this.args.updateInterval ?? ONE_MINUTE;
  @tracked versionFileName = this.args.versionFileName ?? '/VERSION.txt';
  @tracked firstCheckInterval = this.args.firstCheckInterval ?? 0;
  @tracked updateMessage =
    this.args.updateMessage ??
    'This application has been updated from version {oldVersion} to {newVersion}. Please save any work, then refresh browser to see changes.';
  @tracked showReload = this.args.showReload ?? true;
  @tracked reloadButtonText = this.args.reloadButtonText ?? 'Reload';
  @tracked onNewVersion = this.args.onNewVersion
    ? this.args.onNewVersion
    : () => {};
  @tracked onError = this.args.onError
    ? this.args.onError
    : (e) => {
        if (!Ember.testing) {
          console.log(e);
        }
      };

  // internal state:
  @tracked message = '';
  @tracked lastVersion = null;
  @tracked version = null;

  get _fastboot() {
    let owner = getOwner(this);
    return owner.lookup('service:fastboot');
  }

  get url() {
    const config = getOwner(this).resolveRegistration('config:environment');
    const versionFileName = config.newVersion?.fileName || this.versionFileName;
    const baseUrl =
      config.newVersion?.prepend || config.rootURL || config.baseURL;

    if (!config || baseUrl === '/') {
      return versionFileName;
    }

    return baseUrl + versionFileName;
  }

  constructor() {
    super(...arguments);

    if (this._fastboot?.isFastBoot) {
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
  }

  get updateIntervalWithTesting() {
    let enableInTests = this.enableInTests;
    return !enableInTests && Ember.testing ? 0 : this.updateInterval;
  }

  @task
  *updateVersion() {
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

            this.message = message;
            this.lastVersion = currentVersion;

            this.onNewVersion(newVersion, currentVersion);
          }

          this.version = newVersion;
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
  }

  updateNeeded(currentVersion, newVersion) {
    return currentVersion && newVersion !== currentVersion;
  }

  reload() {
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload(true);
    }
  }

  close() {
    this.message = undefined;
  }
}
