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
* `updateInterval` - the amount of time, in milliseconds, to wait between version checks **default: 5000**
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
  newVersion: true
});
```
This will result in `dist/VERSION.txt` being created.

To override the version filename:

```js
var app = new EmberApp(defaults, {
  fileName: 'MY-VERSION.txt'
});
```
This will result in `dist/MY-VERSION.txt` being created. Note that this will also update the default `versionFileName` attribute in the `{{new-version-notifier}}` component.

## Contributing

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
