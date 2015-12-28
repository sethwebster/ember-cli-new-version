# Ember-cli-new-version
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

## Contributing

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
