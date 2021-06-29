module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    // Add addons to package.json and run defaultBlueprint
    return this.addAddonToProject('ember-fetch');
  },
};
