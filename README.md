# ember-cli-new-version
---
[ ![Codeship Status for sethwebster/ember-cli-new-version](https://codeship.com/projects/ff91d8b0-8f28-0133-7b3b-2e70819c478c/status?branch=master)](https://codeship.com/projects/124163)
[![npm version](https://badge.fury.io/js/ember-cli-new-version.svg)](https://badge.fury.io/js/ember-cli-new-version)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-new-version.svg)](http://emberobserver.com/addons/ember-cli-new-version)

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
* updateInterval - the amount of time, in milliseconds, to wait between version checks **default: 5000**
* versionFileName - the name of the file on the server to check **default: /VERSION.txt**
* updateMessage - the message to show to users when update has been detected. There are two tokens allowed in this string: ```{{newVersion}}``` and ```{{oldVersion}}``` which will replaced with their respective values.
  eg. (and **default**). "This application has been updated from version {{oldVersion}} to {{newVersion}}. Please save any work, then refresh browser to see changes."
* showReload - _true_ shows a reload button the user can click to refresh. _false_ hides the button. **default: true**

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

## Contributing

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
