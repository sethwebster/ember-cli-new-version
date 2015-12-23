import Ember from 'ember';

export default Ember.Component.extend({
  updateInterval: 5000,
  tagName: "div",
  versionFileName: "/VERSION.txt",
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
        if (self.get('version') && self.compareVersions(res, self.get('version')) === -1) {
          var message = self.get("updateMessage")
            .replace("{{oldVersion}}",self.get('version'))
            .replace("{{newVersion}}",res);
          self.set('message', message);
        }
        self.set('version',res);
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
    }
  }
});
