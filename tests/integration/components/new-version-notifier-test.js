import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from '../../helpers/setup-mirage';
import Mirage from 'ember-cli-mirage';
import { set } from '@ember/object';

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

    await waitUntil(() => callCount === 6, { timeout: 490 });
    assert.equal(callCount, 6);
    assert.equal(find("#version-value").textContent, "v1.0.3");
    assert.equal(find("#last-version-value").textContent, "v1.0.2");
  });

  test('it calls onNewVersion when a new version is detected', async function(assert) {
    assert.expect(4);
    let done = assert.async(2);

    let callCount = 0;

    this.server.get('/VERSION.txt', function(){
      ++callCount;
      return `v1.0.${callCount}`;
    });

    set(this, "onNewVersion", (newVersion, oldVersion) => {
      assert.equal(newVersion, "v1.0.2", "newVersion v1.0.2 is sent to onNewVersion");
      assert.equal(oldVersion, "v1.0.1", "oldVersion v1.0.1 is sent to onNewVersion");
      done();
    });
    set(this, "enableInTests", true);

    render(hbs`{{new-version-notifier updateInterval=100 enableInTests=enableInTests onNewVersion=onNewVersion}}`);

    await waitUntil(() => callCount === 1, { timeout: 95 });
    assert.equal(callCount, 1, "1 call was made");

    await waitUntil(() => callCount === 2, { timeout: 190 });
    assert.equal(callCount, 2);
    set(this, "enableInTests", false); // stop the loop from continuing
    done();
  });

  test('one version', async function(assert) {
    assert.expect(2);

    let callCount = 0;

    this.server.get('/VERSION.txt', function(){
      ++callCount;
      return 'v1.0.3';
    });

    set(this, "onNewVersion", (newVersion, oldVersion) => {
      throw `unexpected call to onNewVersion with ${newVersion}, ${oldVersion}`;
    });

    render(hbs`{{new-version-notifier updateInterval=100 enableInTests=true onNewVersion=onNewVersion}}`);

    await waitUntil(() => callCount === 4, { timeout: 490 });
    assert.equal(find('*').textContent.trim(), '');
    assert.equal(callCount, 4);
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

    set(this, "onNewVersion", (newVersion, oldVersion) => {
      throw `unexpected call to onNewVersion with ${newVersion}, ${oldVersion}`;
    });

    render(hbs`{{new-version-notifier updateInterval=100 enableInTests=true onNewVersion=onNewVersion}}`);

    await waitUntil(() => callCount === 4, { timeout: 490 });
    assert.equal(find('*').textContent.trim(), '');
    assert.equal(callCount, 4);
  });
});
