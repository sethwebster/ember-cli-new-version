/*jshint esnext:true */

import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,
  updateInterval: 60000, // One Minute Default
  tagName: "div",
  versionFileName: "/VERSION.txt",
  versionFilePath: Ember.computed.alias("versionFileName"),
  updateMessage:"This application has been updated from version {{oldVersion}} to {{newVersion}}. Please save any work, then refresh browser to see changes.",
  showReload: true,
  showReloadButton: Ember.computed.alias("showReload"),
  url: Ember.computed('versionFileName', function() {
    var config = getOwner(this).resolveRegistration('config:environment');
    var versionFileName = this.get('versionFileName');
    var baseUrl = config.rootURL || config.baseURL;

    if (!config || baseUrl === '/') {
      return versionFileName;
    }

    return baseUrl + versionFileName;
  }).readOnly(),
  
  init: function() {
    this._super(...arguments);
    this.updateVersion();
  },
  
  updateVersion() {
    var t = setTimeout(() => {
      let currentTimeout = this.get('_timeout');
      let url = this.get('url');
      
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      Ember.$.ajax(url, { cache: false }).then((res) => {
        let currentVersion = this.get('version');
        let newVersion = res && res.trim();
        let compareVersions = this.get('compareVersions');
        let versionChanged = typeof compareVersions === 'function' ?
          compareVersions(currentVersion, newVersion) :
          currentVersion && newVersion !== currentVersion;

        if (versionChanged) {
          let message = this.get("updateMessage")
            .replace("{{oldVersion}}", currentVersion)
            .replace("{{newVersion}}", newVersion);

          this.setProperties({
            message,
            lastVersion: currentVersion
          });
        }

        this.set('version', newVersion);
      }).always(() => {
        this.set('_timeout', setTimeout(() => {
          this.updateVersion();
        }, this.get('updateInterval')));
      });
    }, 10);
    
    this.set('_timeout', t);
  },
  
  willDestroy() {
    this._super(...arguments);
    clearTimeout(this.get('_timeout'));
  },
  
  actions: {
    reload() {
      location.reload();
    },

    close() {
      this.set('message', undefined);
    }
  }
});
