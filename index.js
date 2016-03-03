/* jshint node: true */
'use strict';

var writeFile = require('broccoli-file-creator');

module.exports = {
  name: 'ember-cli-new-version',

  included: function(app, parentAddon) {
    this.options = app.options.newVersion || {};

    if (this.options === true) {
      this.options = { fileName: 'VERSION.txt' };
    }
  },

  treeForPublic: function() {
    var content = this.parent.pkg.version || '';
    var fileName = this.options.fileName;

    if (this.options.fileName) {
      this.ui.writeLine('Created ' + fileName);
      return writeFile(fileName, content);
    }
  }
};
