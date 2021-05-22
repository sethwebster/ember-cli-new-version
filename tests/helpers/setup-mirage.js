import { startMirage } from '../../initializers/ember-cli-mirage';

export default function setupMirage(hooks) {
  hooks.beforeEach(function () {
    this.server = startMirage();
  });
  hooks.afterEach(function () {
    this.server.shutdown();
  });
}
