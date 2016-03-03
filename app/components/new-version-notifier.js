/*jshint esnext:true */

import config from '../config/environment';
import NewVersionNotifier from 'ember-cli-new-version/components/new-version-notifier/component';

let versionFileName = `/${config.newVersion.fileName}` || '/VERSION.txt';

export default NewVersionNotifier.extend({
  versionFileName
});
