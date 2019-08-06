# ember-cli-new-version

[![Build Status](https://travis-ci.org/sethwebster/ember-cli-new-version.svg?branch=master)](https://travis-ci.org/sethwebster/ember-cli-new-version)

A convention-based version update notifier. Use it to notify users already on the page that a new version has been deployed.

## Compatibility

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above

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

**viola**!

### Options ###
----
* `updateInterval` - the amount of time, in milliseconds, to wait between version checks **default: 60000**
* `firstCheckInterval` - the amount of time, in milliseconds, to wait before the first version check is run after booting the application **default: 0**
* `versionFileName` - the name of the file on the server to check **default: /VERSION.txt**
* `updateMessage` - the message to show to users when update has been detected. There are two tokens allowed in this string: `{newVersion}` and `{oldVersion}` which will replaced with their respective values.
  eg. (and **default**). "This application has been updated from version {oldVersion} to {newVersion}. Please save any work, then refresh browser to see changes."
* `showReload` - _true_ shows a reload button the user can click to refresh. _false_ hides the button. **default: true**
* `reloadButtonText` - Sets the text for the default reload button. **default: "Reload"**
* `onNewVersion(newVersion, oldVersion)` - a closure action that is called whenever a new version is detected. You can use this to track the version status elsewhere in your app (outside the component).
* `updateNeeded(oldVersion, newVersion)` - a function that is called to check if an update message should be shown.   For example, a function could be passed that only shows a message on major version changes. **default: Always show message on any version change**

```handlebars
<NewVersionNotifier
  @versionFileName="/version"
  @updateMessage="A new version was released: {newVersion}"
  @updateInterval={{150000}}
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
    <button type="button" onclick={{action reload}}>Reload</button>
    <button type="button" onclick={{action close}}>Close</button>
  </div>
</NewVersionNotifier>
```

## Automatic VERSION file creation

You can opt-in to automatically generating a `VERSION.txt` during the build process. Opting-in means you don't need maintain a `/public/VERSION.txt` in your project. Simply add the following to `ember-cli-build.js`:

```js
let app = new EmberApp(defaults, {
  newVersion: {
    enabled: true
  }
});
```
This will result in `dist/VERSION.txt` being created.

To override the version filename:

```js
let app = new EmberApp(defaults, {
  newVersion: {
    enabled: true,
    fileName: 'MY-VERSION.txt'
  }
});
```
This will result in `dist/MY-VERSION.txt` being created. Note that this will also update the default `versionFileName` attribute in the `{{new-version-notifier}}` component.

### Supports `ember-cli-app-version`

Since version 1.2.0 this addons is able to use the version string provided by [ember-cli-app-version](https://github.com/ember-cli/ember-cli-app-version).

All you have to do is install `ember-cli-app-version` and enable a flag in `ember-cli-build.js`.

Then an update is triggered based on full version strings with build metadata such as `1.0.0-beta-2-e1dffe1`.

```js
let app = new EmberApp(defaults, {
  newVersion: {
    enabled: true,
    useAppVersion: true
  }
});
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
