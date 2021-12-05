# ember-cli-new-version

[![Build Status](https://travis-ci.org/sethwebster/ember-cli-new-version.svg?branch=master)](https://travis-ci.org/sethwebster/ember-cli-new-version)

A convention-based version update notifier. Use it to notify users already on the page that a new version has been deployed.

## Compatibility

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v12 or above

## Usage

1. Add this add-on as you would any other:
  ```bash
  > ember install ember-cli-new-version
  ```

2. Add a version file to your app, eg:
  _./public/VERSION.txt_

  ```bash
  1.0.0
  ```

3. Include the component in your view:
  ```handlebars
  <NewVersionNotifier/>
  ```

**voila**!

## Configuration

To setup, you should first configure the service through `config/environment`:

```javascript
module.exports = function (environment) {
  var ENV = {
    newVersion: {
      currentVersion: null,
      versionFileName: 'VERSION.txt',
      updateInterval: 60000,
      firstCheckInterval: 0,
      enableInTests: false,
      maxCountInTesting: 10,    
    },
  };
};
```

----
* `currentVersion` - The current version of the app if not using [Automatic VERSION file creation][#Automatic VERSION file creation] **default: null**
* `versionFileName` - the name of the file on the server to check **default: /VERSION.txt**
* `updateInterval` - the amount of time, in milliseconds, to wait between version checks **default: 60000**
* `firstCheckInterval` - the amount of time, in milliseconds, to wait before the first version check is run after booting the application **default: 0**
* `enableInTests` - Should the version checking run in test environments? **default: false**
* `maxCountInTesting` - How many times to check for a new version in tests. **default: 10**


## Automatic Version File Creation ##
If no `VERSION.txt` file exists it will be automatically generated during the build process 
with the value of `currentVersion` or the `version` from `package.json`.

### Supports `ember-cli-app-version`

Since version 4.0.0 this addons will use the version string provided by [ember-cli-app-version](https://github.com/ember-cli/ember-cli-app-version) if no `currentVersion` is configured.

All you have to do is install `ember-cli-app-version`.

Then an update is triggered based on full version strings with build metadata such as `1.0.0-beta-2-e1dffe1`.

### Notifier Configuration and Interface ###
----
* `updateMessage` - the message to show to users when update has been detected. There are two tokens allowed in this string: `{newVersion}` and `{oldVersion}` which will replaced with their respective values.
  eg. (and **default**). "This application has been updated from version {oldVersion} to {newVersion}. Please save any work, then refresh browser to see changes."
* `showReload` - _true_ shows a reload button the user can click to refresh. _false_ hides the button. **default: true**
* `reloadButtonText` - Sets the text for the default reload button. **default: "Reload"**


```handlebars
<NewVersionNotifier
  @updateMessage="A new version was released: {newVersion}"
  @showReload={{true}}
/>
```

### Custom Notification ###

By default the notification is styled as a Bootstrap Alert. If you want custom layouts or
to use a different framework, then you can define your own markup for the notification.

```hbs
<NewVersionNotifier as |version lastVersion reload close|>
  <div class="custom-notification">
    Reload to update to the new version ({{version}}) of this application
    <button type="button" {{on "click" reload}}>Reload</button>
    <button type="button" {{on "click" close}}>Close</button>
  </div>
</NewVersionNotifier>
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
