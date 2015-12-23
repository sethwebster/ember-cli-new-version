import Ember from 'ember';

export default Ember.Component.extend({
  updateInterval: 5000,
  tagName: "div",
  prefixText: "Notice:",
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

      Ember.$.ajax('/VERSION.txt').then(function(res){
        if (self.get('version') && self.compareVersions(res, self.get('version')) === -1) {
          self.set('message', 'This application has been updated. Please save any work, then refresh browser to see changes. '+ res);
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
  }
});
