import { render, waitUntil } from '@ember/test-helpers';
import NewVersionService from 'ember-cli-new-version/services/new-version';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

class TestNewVersionService extends NewVersionService {
  get _newVersionConfig() {
    const config = super._newVersionConfig;
    config.enableInTests = true;
    config.updateInterval = 100;
    config.currentVersion = 'v1.0.1';
    return config;
  }
}

module('Integration | Component | new version notifier', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:new-version', TestNewVersionService);
  });

  test('it shows when a new version is available', async function (assert) {
    let called = false;

    this.server.get('/VERSION.txt', function () {
      setTimeout(() => {
        called = true;
      }, 20);
      return 'v1.0.2';
    });

    render(hbs`<NewVersionNotifier />`);

    await waitUntil(() => called, { timeout: 50 });

    assert
      .dom('.update-notification')
      .containsText(
        'This application has been updated from version v1.0.1 to v1.0.2. Please save any work, then refresh browser to see changes.'
      );
  });

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
      <NewVersionNotifier as |version lastVersion|>
        <div id="version-value">{{version}}</div>
        <div id="last-version-value">{{lastVersion}}</div>
      </NewVersionNotifier>
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
    assert.dom('#last-version-value').hasText('v1.0.1');
  });
});
