/*jshint esnext:true */

import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  newVersionNotifier: Ember.inject.service(),

  layout: layout,
  tagName: "div",

  updateMessage:"This application has been updated from version {{oldVersion}} to {{newVersion}}. Please save any work, then refresh browser to see changes.",
  showReload: true,
  showReloadButton: Ember.computed.alias("showReload"),

  onDidInsertElement: Ember.on('didInsertElement', function(){
    this.get('newVersionNotifier').one('newVersion', this, 'onNewVersion');
    this.get('newVersionNotifier').startTimer();
  }),

  onWillDestroyElement: Ember.on('willDestroyElement', function(){
    this.get('newVersionNotifier').off('newVersion', this, 'onNewVersion');
    this.get('newVersionNotifier').stopTimer();
  }),

  onNewVersion: function(){
      var message = this.get("updateMessage")
        .replace("{{oldVersion}}", this.get('newVersionNotifier.currentVersion'))
        .replace("{{newVersion}}", this.get('newVersionNotifier.newVersion'));

      this.set('message', message);
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
