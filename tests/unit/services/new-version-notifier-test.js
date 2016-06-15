import { moduleFor, test } from 'ember-qunit';
import startMirage from '../../helpers/setup-mirage-for-integration';
import Ember from 'ember';

moduleFor('service:new-version-notifier', 'Unit | Service | new version notifier', {
  // Specify the other units that are required for this test.
  needs: ['service:ajax'],
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('it updates version', function(assert) {
  window.server.get('/VERSION.txt', function(){
    return 'v1.0.0';
  });

  let service = this.subject();
  service.set('updateInterval', 100);
  service.startTimer();

  stop();
  Ember.run.later(function(){
    start();
    assert.equal(service.get('currentVersion'), "v1.0.0");
    assert.equal(service.get('newVersion'), "v1.0.0");
    service.stopTimer();
    assert.ok(service);
  }, 200);

});
