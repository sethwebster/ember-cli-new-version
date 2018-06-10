import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from '../../helpers/setup-mirage';
import Mirage from 'ember-cli-mirage';

module('Integration | Component | new version notifier', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it yields the current and last version to the block', async function(assert) {
    assert.expect(9);

    let callCount = 0;

    this.server.get('/VERSION.txt', function(){
      ++callCount;
      
      return callCount < 4 ? 'v1.0.' + callCount : 'v1.0.3';
    });

    render(hbs`
      {{#new-version-notifier updateInterval=100 enableInTests=true as |version lastVersion reload close|}}
        <div id="version-value">{{version}}</div>
        <div id="last-version-value">{{lastVersion}}</div>
      {{/new-version-notifier}}
    `);

    await waitUntil(() => callCount === 1, { timeout: 95 });

    assert.equal(callCount, 1, "1 call was made");
    assert.notOk(find("#version-value"), "no version displayed when no upgrade available");
    assert.notOk(find("#last-version-value"), "no last version displayed when no upgrade available");

    await waitUntil(() => callCount === 2, { timeout: 190 });

    assert.equal(callCount, 2);
    assert.equal(find("#version-value").textContent, "v1.0.2");
    assert.equal(find("#last-version-value").textContent, "v1.0.1");
    // assert.equal(find('*').textContent.trim().replace(/\n|\t/, ''), 'This application has been updated from version v1.0.1 to v1.0.2. Please save any work, then refresh browser to see changes. Reload      ×');

    await waitUntil(() => callCount === 6, { timeout: 490 });
    assert.equal(callCount, 6);
    assert.equal(find("#version-value").textContent, "v1.0.3");
    assert.equal(find("#last-version-value").textContent, "v1.0.2");
    // assert.equal(find('*').textContent.trim().replace(/\n|\t/, ''), 'This application has been updated from version v1.0.2 to v1.0.3. Please save any work, then refresh browser to see changes. Reload      ×');
  });

  test('one version', async function(assert) {
    assert.expect(2);

    let callCount = 0;

    this.server.get('/VERSION.txt', function(){
      ++callCount;
      return 'v1.0.3';
    });

    render(hbs`{{new-version-notifier updateInterval=100 enableInTests=true}}`);

    await waitUntil(() => callCount === 4, { timeout: 490 });
    assert.equal(find('*').textContent.trim(), '');
    assert.equal(callCount, 4);
    // assert.equal(this.get('version'), 'v1.0.3');
    // assert.equal(this.get('lastVersion'), null);
  });

  test('repeat on bad response', async function(assert) {
    assert.expect(2);

    let callCount = 0;

    this.server.get('/VERSION.txt', function(){
      ++callCount;

      if (callCount === 1) {
        return new Mirage.Response(500, {}, { message: '' });
      }

      return 'v1.0.3';
    });

    render(hbs`{{new-version-notifier updateInterval=100 enableInTests=true}}`);

    await waitUntil(() => callCount === 4, { timeout: 490 });
    assert.equal(find('*').textContent.trim(), '');
    assert.equal(callCount, 4);
    // assert.equal(this.get('version'), 'v1.0.3');
    // assert.equal(this.get('lastVersion'), null);
  });
});
