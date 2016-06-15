import Ember from 'ember';
const { getOwner } = Ember;


export default Ember.Service.extend(Ember.Evented, {
  ajax: Ember.inject.service(),

  updateInterval: 1000*60,
  versionFileName: "/VERSION.txt",

  currentVersion: null,
  newVersion: null,

  url: Ember.computed('versionFileName', function() {
    var config = getOwner(this).resolveRegistration('config:environment');
    var versionFileName = this.get('versionFileName');

    if (!config || config.baseURL === '/') {
      return versionFileName;
    }

    return config.baseURL + versionFileName;
  }).readOnly(),

  init: function() {
    this._super(...arguments);
  },

  startTimer() {
    var self = this;

    var timer = Ember.run.later(this, function(){
      this.getVersion().then(function(newVersion){
        self.updateVersion(newVersion);
        self.startTimer();
      });
    }, this.get('updateInterval'));

    this.set('timer', timer);
  },

  getVersion(){
    return this.get('ajax').request(this.get('url'), {
      cache: false,
      dataType: 'text'
    });
  },

  updateVersion(newVersion){
    if(!this.get('currentVersion')){
      this.set('currentVersion', newVersion);
    }

    this.set('newVersion', newVersion);

    if(this.get('currentVersion') !== this.get('newVersion')){
      this.trigger('newVersion');
    }
  },

  stopTimer() {
    if(this.has('newVersion')){
        return; // Do not stop Timer if there are subscriber
    }

    var timer = this.get('timer');
    if(timer){
      Ember.run.cancel(timer);
      this.set('timer', undefined);
    }
  }

});
