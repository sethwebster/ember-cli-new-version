import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | index', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /', async function (assert) {
    this.server.get('/VERSION.txt', function () {
      return 'v1.0.3';
    });

    await visit('/');

    assert.strictEqual(currentURL(), '/');
  });
});
