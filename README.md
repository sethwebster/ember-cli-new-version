# ember-cli-new-version

[![Build Status](https://travis-ci.org/sethwebster/ember-cli-new-version.svg?branch=master)](https://travis-ci.org/sethwebster/ember-cli-new-version)

A convention-based version update notifier.

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
  {{new-version-notifier}}
  ```

**viola**!

### Options ###
----
* `updateInterval` - the amount of time, in milliseconds, to wait between version checks **default: 60000**
* `versionFileName` - the name of the file on the server to check **default: /VERSION.txt**
* `updateMessage` - the message to show to users when update has been detected. There are two tokens allowed in this string: ```{{newVersion}}``` and ```{{oldVersion}}``` which will replaced with their respective values.
  eg. (and **default**). "This application has been updated from version {{oldVersion}} to {{newVersion}}. Please save any work, then refresh browser to see changes."
* `showReload` - _true_ shows a reload button the user can click to refresh. _false_ hides the button. **default: true**
* `reloadButtonText` - Sets the text for the default reload button. **default: "Reload"**

```handlebars
{{new-version-notifier updateInterval=<value> versionFileName="<value>" updateMessage="<value>" showReload=true}}
```

### Custom Notification ###

By default the notification is styled as a Bootstrap Alert. If you want custom layouts or
to use a different framework, then you can define your own markup for the notification.

```hbs
{{#new-version-notifier as |version lastVersion reload close|}}
  <div class="custom-notification">
    Reload to update to the new version ({{version}}) of this application
    <button type="button" onclick={{action reload}}>Reload</button>
    <button type="button" onclick={{action close}}>Close</button>
  </div>
{{/new-version-notifier}}
```

## Automatic VERSION file creation

You can opt-in to automatically generating a `VERSION.txt` during the build process. Opting-in means you don't need maintain a `/public/VERSION.txt` in your project. Simply add the following to `ember-cli-build.js`:

```js
var app = new EmberApp(defaults, {
  newVersion: {
    enabled: true,
  }
});
```
This will result in `dist/VERSION.txt` being created.

To override the version filename:

```js
var app = new EmberApp(defaults, {
  newVersion: {
    enabled: true,
    fileName: 'MY-VERSION.txt'
  }
  
});
```
This will result in `dist/MY-VERSION.txt` being created. Note that this will also update the default `versionFileName` attribute in the `{{new-version-notifier}}` component.

### Supports `ember-cli-app-version`

Since version 1.6.0 this addons is able to use the version string provided by [ember-cli-app-version](https://github.com/ember-cli/ember-cli-app-version).

All you have to do is install `ember-cli-app-version` and enable a flag in `ember-cli-build.js`.

Then an update is triggered based on full version strings with build metadata such as `1.0.0-beta-2-e1dffe1`.

```js
var app = new EmberApp(defaults, {
  newVersion: {
    enabled: true,
    useAppVersion: true
  }  
});
```

## Contributing

### Installation

* `git clone <repository-url>`
* `cd my-addon`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## License

This project is licensed under the [MIT License](LICENSE.md).
