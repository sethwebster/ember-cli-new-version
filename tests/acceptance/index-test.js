import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    window.server.get('/VERSION.txt', function(){
      return 'v1.0.3';
    });

    await visit('/');

    assert.equal(currentURL(), '/');
  });
});
