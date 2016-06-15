import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';


const serviceMock = Ember.Service.extend(Ember.Evented, {
  startTimer(){

  },
  stopTimer(){

  },
  triggerNewVersion(){
    this.set('currentVersion', 'v1.0.0');
    this.set('newVersion', 'v1.0.1');
    this.trigger('newVersion');
  }
});

moduleForComponent('new-version-notifier', 'Integration | Component | new version notifier', {
  integration: true,

  beforeEach() {
    this.register('service:new-version-notifier', serviceMock);
    this.inject.service('new-version-notifier', { as: 'newVersionNotifier' });
  }
});


test('it renders hidden', function(assert) {
  this.render(hbs`{{new-version-notifier}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#new-version-notifier}}
      template block text
    {{/new-version-notifier}}
  `);

  assert.equal(this.$().text().trim(), '');
});

test('it renders on new version', function(assert) {
  var self = this;
  this.render(hbs`{{new-version-notifier}}`);


  Ember.run(function(){
    self.newVersionNotifier.triggerNewVersion();
  });



  assert.equal(this.$().text().trim(), 'This application has been updated from version v1.0.0 to v1.0.1. Please save any work, then refresh browser to see changes. Reload');
});
