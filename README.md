# ember-cli-new-version
---
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
  {{ember-cli-new-version}}
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
{{ember-cli-new-version updateInterval=<value> versionFileName="<value>" updateMessage="<value>" showReload=true}}
```

### Custom Notification ###

By default the notification is styled as a Bootstrap Alert. If you want custom layouts or
to use a different framework, then you can define your own markup for the notification.

```hbs
{{#ember-cli-new-version as |version lastVersion reload close|}}
  <div class="custom-notification">
    Reload to update to the new version ({{version}}) of this application
    <button type="button" onclick={{action reload}}>Reload</button>
    <button type="button" onclick={{action close}}>Close</button>
  </div>
{{/ember-cli-new-version}}
```

## Contributing

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
