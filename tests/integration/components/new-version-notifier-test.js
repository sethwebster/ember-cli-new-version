import { later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs                          from 'htmlbars-inline-precompile';
import setupMirage                  from '../../helpers/setup-mirage-for-integration';
import Mirage                       from 'ember-cli-mirage';


module('Integration | Component | new version notifier', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it works', async function(assert) {
    assert.expect(12);

    let callCount = 0;

    this.setProperties({
      version:     null,
      lastVersion: null
    });

    this.server.get('/VERSION.txt', function(){
      ++callCount;
      
      return callCount < 4 ? 'v1.0.' + callCount : 'v1.0.3';
    });

    await render(hbs`{{new-version-notifier updateInterval=200 version=version lastVersion=lastVersion}}`);

    const done = assert.async(3);

    later(() => {
      assert.equal(find('*').textContent.trim(), '');
      assert.equal(callCount, 1);
      assert.equal(this.get('version'), 'v1.0.1');
      assert.equal(this.get('lastVersion'), null);

      done();
    }, 0);

    later(() => {
      assert.equal(callCount, 2);
      assert.equal(this.get('version'), 'v1.0.2');
      assert.equal(this.get('lastVersion'), 'v1.0.1');
      assert.equal(find('*').textContent.trim().replace(/\n|\t/, ''), 'This application has been updated from version v1.0.1 to v1.0.2. Please save any work, then refresh browser to see changes. Reload      ×');

      done();
    }, 300);

    later(() => {
      assert.equal(callCount, 6);
      assert.equal(this.get('version'), 'v1.0.3');
      assert.equal(this.get('lastVersion'), 'v1.0.2');
      assert.equal(find('*').textContent.trim().replace(/\n|\t/, ''), 'This application has been updated from version v1.0.2 to v1.0.3. Please save any work, then refresh browser to see changes. Reload      ×');

      done();
    }, 1150);
  });

  test('one version', async function(assert) {
    assert.expect(4);

    let callCount = 0;

    this.setProperties({
      version:     null,
      lastVersion: null
    });

    this.server.get('/VERSION.txt', function(){
      ++callCount;

      return 'v1.0.3';
    });

    await render(hbs`{{new-version-notifier updateInterval=100 version=version lastVersion=lastVersion}}`);

    const done = assert.async(1);

    later(() => {
      assert.equal(find('*').textContent.trim(), '');
      assert.equal(callCount, 4);
      assert.equal(this.get('version'), 'v1.0.3');
      assert.equal(this.get('lastVersion'), null);

      done();
    }, 350);
  });

  test('repeat on bad response', async function(assert) {
    assert.expect(4);

    let callCount = 0;

    this.setProperties({
      version:     null,
      lastVersion: null
    });

    this.server.get('/VERSION.txt', function(){
      ++callCount;

      if (callCount === 1) {
        return new Mirage.Response(500, {}, { message: '' });
      }

      return 'v1.0.3';
    });

    await render(hbs`{{new-version-notifier updateInterval=100 version=version lastVersion=lastVersion}}`);

    const done = assert.async(1);

    later(() => {
      assert.equal(find('*').textContent.trim(), '');
      assert.equal(callCount, 4);
      assert.equal(this.get('version'), 'v1.0.3');
      assert.equal(this.get('lastVersion'), null);

      done();
    }, 350);
  });
});
