import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from '../../helpers/setup-mirage';
import Mirage from 'ember-cli-mirage';
import { set } from '@ember/object';

module('Integration | Component | new version notifier', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it yields the current and last version to the block', async function (assert) {
    assert.expect(9);

    let called = false;
    let callCount = 0;

    this.server.get('/VERSION.txt', function () {
      setTimeout(() => {
        called = true;
      }, 20); // dirty workaround, because fetch sometimes returns after waitUntil if this is set to 0
      ++callCount;

      return callCount < 4 ? 'v1.0.' + callCount : 'v1.0.3';
    });

    render(hbs`
      {{#new-version-notifier updateInterval=100 enableInTests=true as |version lastVersion reload close|}}
        <div id="version-value">{{version}}</div>
        <div id="last-version-value">{{lastVersion}}</div>
      {{/new-version-notifier}}
    `);

    await waitUntil(() => called, { timeout: 50 });

    assert.equal(callCount, 1, '1 call was made');
    assert
      .dom('#version-value')
      .doesNotExist('no version displayed when no upgrade available');
    assert
      .dom('#last-version-value')
      .doesNotExist('no last version displayed when no upgrade available');
    called = false;

    await waitUntil(() => called, { timeout: 150 });

    assert.equal(callCount, 2);
    assert.dom('#version-value').hasText('v1.0.2');
    assert.dom('#last-version-value').hasText('v1.0.1');
    called = false;

    await waitUntil(() => called, { timeout: 250 });
    assert.equal(callCount, 3);
    assert.dom('#version-value').hasText('v1.0.3');
    assert.dom('#last-version-value').hasText('v1.0.2');
  });

  test('it calls onNewVersion when a new version is detected', async function (assert) {
    assert.expect(4);
    let done = assert.async(2);

    let callCount = 0;

    this.server.get('/VERSION.txt', function () {
      ++callCount;
      return `v1.0.${callCount}`;
    });

    set(this, 'onNewVersion', (newVersion, oldVersion) => {
      assert.equal(
        newVersion,
        'v1.0.2',
        'newVersion v1.0.2 is sent to onNewVersion'
      );
      assert.equal(
        oldVersion,
        'v1.0.1',
        'oldVersion v1.0.1 is sent to onNewVersion'
      );
      done();
    });
    set(this, 'enableInTests', true);

    render(
      hbs`{{new-version-notifier updateInterval=100 enableInTests=enableInTests onNewVersion=onNewVersion}}`
    );

    await waitUntil(() => callCount === 1, { timeout: 95 });
    assert.equal(callCount, 1, '1 call was made');

    await waitUntil(() => callCount === 2, { timeout: 190 });
    assert.equal(callCount, 2);
    set(this, 'enableInTests', false); // stop the loop from continuing
    done();
  });

  test('one version', async function (assert) {
    assert.expect(2);

    let callCount = 0;

    this.server.get('/VERSION.txt', function () {
      ++callCount;
      return 'v1.0.3';
    });

    set(this, 'onNewVersion', (newVersion, oldVersion) => {
      throw `unexpected call to onNewVersion with ${newVersion}, ${oldVersion}`;
    });

    render(
      hbs`{{new-version-notifier updateInterval=100 enableInTests=true onNewVersion=onNewVersion}}`
    );

    await waitUntil(() => callCount === 4, { timeout: 490 });
    assert.dom(document.querySelector('#ember-testing-container')).hasText('');
    assert.equal(callCount, 4);
  });

  test('repeat on bad response', async function (assert) {
    assert.expect(2);

    let callCount = 0;

    this.server.get('/VERSION.txt', function () {
      ++callCount;

      if (callCount === 1) {
        return new Mirage.Response(500, {}, { message: '' });
      }

      return 'v1.0.3';
    });

    set(this, 'onNewVersion', (newVersion, oldVersion) => {
      throw `unexpected call to onNewVersion with ${newVersion}, ${oldVersion}`;
    });

    render(
      hbs`{{new-version-notifier updateInterval=100 enableInTests=true onNewVersion=onNewVersion}}`
    );

    await waitUntil(() => callCount === 4, { timeout: 490 });
    assert.dom(document.querySelector('#ember-testing-container')).hasText('');
    assert.equal(callCount, 4);
  });

  test('it calls onError when request fails', async function (assert) {
    assert.expect(1);

    let called = false;

    this.server.get('/VERSION.txt', function () {
      setTimeout(() => {
        called = true;
      }, 100);
      return new Mirage.Response(500, {}, { message: '' });
    });

    let onErrorCalled = false;
    set(this, 'onError', () => {
      onErrorCalled = true;
    });

    render(
      hbs`{{new-version-notifier updateInterval=100 enableInTests=true onError=onError}}`
    );

    await waitUntil(() => called, { timeout: 150 });
    assert.ok(onErrorCalled, 'onError was called');
  });

  test('it accepts a custom updateNeeded function', async function (assert) {
    assert.expect(5);
    let done = assert.async(2);

    let callCount = 0;

    this.server.get('/VERSION.txt', function () {
      ++callCount;
      switch (callCount) {
        case 0:
          return 'v1.0.0';
        case 1:
          return 'v1.0.1';
        case 2:
          return 'v1.0.2';
        case 3:
          return 'v1.1.0';
        default:
          return null;
      }
    });

    set(this, 'onNewVersion', (newVersion, oldVersion) => {
      assert.equal(
        newVersion,
        'v1.1.0',
        'newVersion v1.1.0 is sent to onNewVersion'
      );
      assert.equal(
        oldVersion,
        'v1.0.2',
        'oldVersion v1.0.2 is sent to onNewVersion'
      );
      done();
    });
    set(this, 'enableInTests', true);

    set(this, 'updateNeeded', function (currentVersion, newVersion) {
      if (!currentVersion) {
        return false;
      }

      // Only compare major and minor version number
      let currentV = currentVersion.substr(0, currentVersion.lastIndexOf('.'));
      let newV = newVersion.substr(0, newVersion.lastIndexOf('.'));

      return newV !== currentV;
    });

    render(
      hbs`{{new-version-notifier updateNeeded=updateNeeded updateInterval=100 enableInTests=enableInTests onNewVersion=onNewVersion}}`
    );

    await waitUntil(() => callCount === 1, { timeout: 95 });
    assert.equal(callCount, 1, '1 call was made');

    await waitUntil(() => callCount === 2, { timeout: 190 });
    assert.equal(callCount, 2);

    await waitUntil(() => callCount === 3, { timeout: 190 });
    assert.equal(callCount, 3);

    set(this, 'enableInTests', false); // stop the loop from continuing
    done();
  });
});
