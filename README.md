# Ember-cli-new-version
---
[ ![Codeship Status for sethwebster/ember-cli-new-version](https://codeship.com/projects/ff91d8b0-8f28-0133-7b3b-2e70819c478c/status?branch=master)](https://codeship.com/projects/124163)

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
