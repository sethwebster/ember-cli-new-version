import Ember                        from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs                          from 'htmlbars-inline-precompile';
import startMirage                  from '../../helpers/setup-mirage-for-integration';


const {
  run: { later }
} = Ember;

moduleForComponent('new-version-notifier', 'Integration | Component | new version notifier', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it works', function (assert) {
  assert.expect(12);

  let callCount = 0;

  this.setProperties({
    version:     null,
    lastVersion: null
  });

  window.server.get('/VERSION.txt', function(){
    ++callCount;

    return callCount < 4 ? 'v1.0.' + callCount : 'v1.0.3';
  });

  this.render(hbs`{{new-version-notifier updateInterval=100 version=version lastVersion=lastVersion}}`);

  const done = assert.async(3);

  later(() => {
    assert.equal(this.$().text().trim(), '');
    assert.equal(callCount, 1);
    assert.equal(this.get('version'), 'v1.0.1');
    assert.equal(this.get('lastVersion'), null);

    done();
  }, 0);

  later(() => {
    assert.equal(callCount, 2);
    assert.equal(this.get('version'), 'v1.0.2');
    assert.equal(this.get('lastVersion'), 'v1.0.1');
    assert.equal(this.$().text().trim().replace(/\n|\t/, ''), 'This application has been updated from version v1.0.1 to v1.0.2. Please save any work, then refresh browser to see changes. Reload      ×');

    done();
  }, 150);

  later(() => {
    assert.equal(callCount, 5);
    assert.equal(this.get('version'), 'v1.0.3');
    assert.equal(this.get('lastVersion'), 'v1.0.2');
    assert.equal(this.$().text().trim().replace(/\n|\t/, ''), 'This application has been updated from version v1.0.2 to v1.0.3. Please save any work, then refresh browser to see changes. Reload      ×');

    done();
  }, 550);
});

test('one version', function (assert) {
  assert.expect(4);

  let callCount = 0;

  this.setProperties({
    version:     null,
    lastVersion: null
  });

  window.server.get('/VERSION.txt', function(){
    ++callCount;

    return 'v1.0.3';
  });

  this.render(hbs`{{new-version-notifier updateInterval=100 version=version lastVersion=lastVersion}}`);

  const done = assert.async(1);

  later(() => {
    assert.equal(this.$().text().trim(), '');
    assert.equal(callCount, 4);
    assert.equal(this.get('version'), 'v1.0.3');
    assert.equal(this.get('lastVersion'), null);

    done();
  }, 350);
});
