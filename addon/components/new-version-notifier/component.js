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
  init: function() {
    this._super();
    this.updateVersion();
  },
  updateVersion() {
    var self = this;
    var t = setTimeout(function(){
      var currentTimeout = self.get('_timeout');
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      Ember.$.ajax(self.get("versionFileName")).then(function(res){
        var currentVersion = self.get('version');
        var newVersion = res && res.trim();
        
        if (currentVersion && self.compareVersions(newVersion, currentVersion) === -1) {
          var message = self.get("updateMessage")
            .replace("{{oldVersion}}",currentVersion)
            .replace("{{newVersion}}",newVersion);
            
          self.setProperties({
            message,
            lastVersion: currentVersion
          });
        }
        
        self.set('version',newVersion);
        self.set('_timeout',setTimeout(function() {
          self.updateVersion();
        },self.get('updateInterval')));
      });
    }, 10);
    self.set('_timeout', t);
  },
  compareVersions(left, right) {
    var leftParts = left.split('.'),
        rightParts = right.split('.');
    for(var i=0;i<Math.min(leftParts.length, rightParts.length);i++) {
      if (parseInt(leftParts[i])>parseInt(rightParts[i])) {
        return -1;
      }
      if (parseInt(leftParts[i])<parseInt(rightParts[i])) {
        return 1;
      }
    }
    if (leftParts.length > rightParts.length) {
      return -1;
    }
    if (rightParts.leght > leftParts.length) {
      return 1;
    }

    return 0;
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
