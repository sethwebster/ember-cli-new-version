/* eslint-env node */
'use strict';

const writeFile = require('broccoli-file-creator');

module.exports = {
  name: require('./package').name,

  /**
   * Setup default configuration options and auto detect the currentVersion if it isn't set manually
   */
  config(env, baseConfig) {
    const defaultConfiguration = {
      versionFileName: 'VERSION.txt',
      firstCheckInterval: 0,
      updateInterval: 60000,
      enableInTests: false,
      maxCountInTesting: 10,
      createVersionFileAutomatically: false,
    };

    baseConfig.newVersion = Object.assign(
      defaultConfiguration,
      baseConfig.newVersion
    );

    if (!baseConfig.newVersion.currentVersion) {
      if (baseConfig.APP.version) {
        //if `ember-cli-app-version` is installed use the detected version from that addon
        baseConfig.newVersion.currentVersion = baseConfig.APP.version;
      } else {
        //otherwise use what is in package.json.
        baseConfig.newVersion.currentVersion = this.parent.pkg.version;
      }
    }

    this._config = baseConfig.newVersion;

    return baseConfig;
  },

  /**
   * Write version file
   */
  treeForPublic() {
    const { currentVersion, createVersionFileAutomatically, versionFileName } =
      this._config;
    if (currentVersion && createVersionFileAutomatically) {
      const fileName = versionFileName;

      this.ui.writeLine(`Created ${fileName} with ${currentVersion}`);
      return writeFile(fileName, currentVersion);
    }
  },
};
