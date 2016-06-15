/* jshint node: true */
'use strict';

var writeFile = require('broccoli-file-creator');

module.exports = {
  name: 'ember-cli-new-version',

  /*
  Store config from `ember-cli-build.js`
   */
  included: function(app/*, parentAddon*/) {
    this.options = app.options.newVersion || {};

    if (this.options === true) {
      this.options = { fileName: 'VERSION.txt' };
    }
  },

  /*
  Set options on the environment configuration object so they can
  be accessed via `import config from '../config/environment';`
   */
  config: function(/*env, baseConfig*/) {
    if (this.options && this.options.fileName) {
      return { newVersion: this.options };
    }
  },

  /*
  Generate version file automatically
  based on package.json of consuming application.
   */
  treeForPublic: function() {
    var content = this.parent.pkg.version || '';
    var fileName = this.options.fileName;

    if (this.options.fileName) {
      this.ui.writeLine('Created ' + fileName);
      return writeFile(fileName, content);
    }
  }
};
