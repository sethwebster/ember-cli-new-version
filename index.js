/* eslint-env node */
'use strict';

const writeFile = require('broccoli-file-creator');

module.exports = {
  name: require('./package').name,
  
  /**
   * Store `ember-cli-build.js` options
   */
  included: function(app/*, parentAddon*/) {
    this._options = app.options.newVersion || {};
    if (this._options.enabled === true) {
      this._options.fileName = this._options.fileName || 'VERSION.txt';
      this._options.prepend  = this._options.prepend  || '';
      this._options.useAppVersion = this._options.useAppVersion || false;
    }
  },

  /**
   * Copy version from `ember-cli-app-version`
   */
  config: function(env, baseConfig) {
    this._appVersion = baseConfig.APP.version || null;
  },

  /**
   * Write version file
   *
   * based on
   *  - ember-cli-app-version if installed
   *  - package.json of consuming application or
   */
  treeForPublic: function() {
    let detectedVersion;

    if (this._options.useAppVersion && this._appVersion) {
      detectedVersion = this._appVersion;
    }

    if (!detectedVersion) {
      detectedVersion = this.parent.pkg.version;
    }

    if (detectedVersion && this._options.enabled) {
      const fileName = this._options.fileName;

      this.ui.writeLine(`Created ${fileName} with ${detectedVersion}`);
      return writeFile(fileName, detectedVersion);
    }
  }
};
