/*eslint no-console: ["error", { allow: ["log"] }] */
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import Ember             from 'ember';
import request           from 'ember-ajax/request';
import layout            from './template';
import { task, timeout } from 'ember-concurrency';

let taskRunCounter = 0;

const MAX_COUNT_IN_TESTING = 10;
const ONE_MINUTE = 60000;

export default Component.extend({
  layout: layout,

  tagName          : '',

  enableInTests    : false,
  updateInterval   : ONE_MINUTE,
  versionFileName  : "/VERSION.txt",
  updateMessage    : "This application has been updated from version {{oldVersion}} to {{newVersion}}. Please save any work, then refresh browser to see changes.",
  showReload       : true,
  reloadButtonText : "Reload",
  onNewVersion(/* version, lastVersion */) {},

  // internal state:
  lastVersion      : null,
  version          : null,

  url: computed('versionFileName', function () {
    const config          = getOwner(this).resolveRegistration('config:environment');
    const versionFileName = get(config, 'newVersion.fileName') || this.get('versionFileName');
    const baseUrl         = get(config, 'newVersion.prepend')  || config.rootURL || config.baseURL;

    if (!config || baseUrl === '/') {
      return versionFileName;
    }

    return baseUrl + versionFileName;
  }).readOnly(),

  init () {
    this._super(...arguments);

    if (Ember.testing) { taskRunCounter = 0; }

    if (!Ember.testing || get(this, 'enableInTests')) {
      this.get('updateVersion').perform();
    }
  },

  updateIntervalWithTesting: computed('updateInterval', 'enableInTests', function() {
    let enableInTests = get(this, 'enableInTests');
    return (!enableInTests && Ember.testing) ? 0 : get(this, 'updateInterval');
  }),

  updateVersion: task(function * () {
    const url = this.get('url');

    try {
      yield request(url, { cache: false, dataType: 'text' })
        .then(res => {
          const currentVersion = this.get('version');
          const newVersion     = res && res.trim();

          if (currentVersion && newVersion !== currentVersion) {
            const message = this.get('updateMessage')
              .replace('{{oldVersion}}', currentVersion)
              .replace('{{newVersion}}', newVersion);

            this.setProperties({
              message,
              lastVersion: currentVersion
            });
            this.onNewVersion(newVersion, currentVersion);
          }

          this.set('version', newVersion);
        });
    } catch (e) {
      if (!Ember.testing) {
        console.log(e);
      }
    } finally {
      let updateInterval = this.get('updateIntervalWithTesting');
      if (updateInterval === null || updateInterval === undefined) { updateInterval = ONE_MINUTE }

      yield timeout(updateInterval);

      if (Ember.testing && ++taskRunCounter > MAX_COUNT_IN_TESTING) { return; }

      if (Ember.testing && !get(this, 'enableInTests')) { return; }
      this.get('updateVersion').perform();
    }
  }),


  actions: {
    reload() {
      if (typeof window !== 'undefined' && window.location) {
        window.location.reload(true);
      }
    },

    close() {
      this.set('message', undefined);
    }
  }
});
