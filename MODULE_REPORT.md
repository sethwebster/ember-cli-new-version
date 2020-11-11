## Module Report
### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/components/new-version-notifier/component.js` at line 30

```js
  onNewVersion(/* version, lastVersion */) {},
  onError(e) {
    if (!Ember.testing) {
      console.log(e);
    }
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/components/new-version-notifier/component.js` at line 63

```js
    }

    if (Ember.testing) { taskRunCounter = 0; }

    if (!Ember.testing || get(this, 'enableInTests')) {
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/components/new-version-notifier/component.js` at line 65

```js
    if (Ember.testing) { taskRunCounter = 0; }

    if (!Ember.testing || get(this, 'enableInTests')) {
      if (this.firstCheckInterval > 0) {
        later(this, () => { this.get('updateVersion').perform(); }, this.firstCheckInterval);
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/components/new-version-notifier/component.js` at line 76

```js
  updateIntervalWithTesting: computed('updateInterval', 'enableInTests', function() {
    let enableInTests = get(this, 'enableInTests');
    return (!enableInTests && Ember.testing) ? 0 : get(this, 'updateInterval');
  }),

```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/components/new-version-notifier/component.js` at line 115

```js
      yield timeout(updateInterval);

      if (Ember.testing && ++taskRunCounter > MAX_COUNT_IN_TESTING) { return; }

      if (Ember.testing && !get(this, 'enableInTests')) { return; }
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/components/new-version-notifier/component.js` at line 117

```js
      if (Ember.testing && ++taskRunCounter > MAX_COUNT_IN_TESTING) { return; }

      if (Ember.testing && !get(this, 'enableInTests')) { return; }
      this.get('updateVersion').perform();
    }
```
