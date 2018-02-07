import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | index');

test('visiting /', function(assert) {
  window.server.get('/VERSION.txt', function(){
    return 'v1.0.3';
  });

  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
  });
});
