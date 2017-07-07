/*jshint esnext:true */

import Ember from 'ember';
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
  reloadButtonText: "Reload",
  url: Ember.computed('versionFileName', function() {
    var config = Ember.getOwner(this).resolveRegistration('config:environment');
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
    var self = this;
    var t = setTimeout(function(){
      var currentTimeout = self.get('_timeout');
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      if(!Ember.$) {
        return;
      }

      Ember.$.ajax(self.get('url'), { cache:false }).then(function(res){
        var currentVersion = self.get('version');
        var newVersion = res && res.trim();

        if (currentVersion && newVersion !== currentVersion) {
          var message = self.get("updateMessage")
            .replace("{{oldVersion}}",currentVersion)
            .replace("{{newVersion}}",newVersion);

          self.setProperties({
            message,
            lastVersion: currentVersion
          });
        }

        self.set('version',newVersion);
      }).always(function() {
          self.set('_timeout', setTimeout(function() {
              self.updateVersion();
          }, self.get('updateInterval')));
      });
    }, 10);
    self.set('_timeout', t);
  },
  willDestroy() {
    this._super(...arguments);
    clearTimeout(this.get('_timeout'));
  },
  actions: {
    reload() {
      if(typeof window !== 'undefined' && window.location) {
        window.location.reload();
      }
    },

    close() {
      this.set('message', undefined);
    }
  }
});
