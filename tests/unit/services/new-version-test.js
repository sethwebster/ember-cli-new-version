import { waitUntil } from '@ember/test-helpers';
import Mirage from 'ember-cli-mirage';
import NewVersionService from 'ember-cli-new-version/services/new-version';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import setupMirage from '../../helpers/setup-mirage';

class TestNewVersionService extends NewVersionService {
  get _newVersionConfig() {
    const config = super._newVersionConfig;
    config.enableInTests = true;
    config.updateInterval = 100;
    config.currentVersion = 'v1.0.1';
    return config;
  }
}

module('Unit | Service | new-version', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('one version', async function (assert) {
    assert.expect(1);

    let callCount = 0;

    this.server.get('/VERSION.txt', function () {
      ++callCount;
      return 'v1.0.3';
    });

    this.owner.register(
      'service:new-version',
      class extends TestNewVersionService {
        onNewVersion(newVersion, oldVersion) {
          throw `unexpected call to onNewVersion with ${newVersion}, ${oldVersion}`;
        }
      }
    );

    this.owner.lookup('service:new-version');

    await waitUntil(() => callCount === 4, { timeout: 490 });
    assert.equal(callCount, 4);
  });

  test('it calls onNewVersion when a new version is detected', async function (assert) {
    assert.expect(4);
    let done = assert.async(2);

    let callCount = 0;

    this.server.get('/VERSION.txt', function () {
      ++callCount;
      return `v1.0.${callCount}`;
    });

    this.owner.register(
      'service:new-version',
      class extends TestNewVersionService {
        onNewVersion(newVersion, oldVersion) {
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
        }
      }
    );

    this.owner.lookup('service:new-version');

    await waitUntil(() => callCount === 1, { timeout: 95 });
    assert.equal(callCount, 1, '1 call was made');

    await waitUntil(() => callCount === 2, { timeout: 190 });
    assert.equal(callCount, 2);

    done();
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

    this.owner.register(
      'service:new-version',
      class extends TestNewVersionService {
        onError() {
          onErrorCalled = true;
        }
      }
    );

    this.owner.lookup('service:new-version');

    await waitUntil(() => called, { timeout: 150 });
    assert.ok(onErrorCalled, 'onError was called');
  });

  test('repeat on bad response', async function (assert) {
    assert.expect(1);

    let callCount = 0;

    this.server.get('/VERSION.txt', function () {
      ++callCount;

      if (callCount === 1) {
        return new Mirage.Response(500, {}, { message: '' });
      }

      return 'v1.0.3';
    });

    this.owner.register(
      'service:new-version',
      class extends TestNewVersionService {
        onNewVersion(newVersion, oldVersion) {
          throw `unexpected call to onNewVersion with ${newVersion}, ${oldVersion}`;
        }
      }
    );

    this.owner.lookup('service:new-version');

    await waitUntil(() => callCount === 4, { timeout: 490 });
    assert.equal(callCount, 4);
  });
});
