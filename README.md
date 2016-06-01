[![Build Status](https://secure.travis-ci.org/ideabile/bespoke-graphview.png?branch=master)](https://travis-ci.org/ideabile/bespoke-graphview) [![Coverage Status](https://coveralls.io/repos/ideabile/bespoke-graphview/badge.png)](https://coveralls.io/r/ideabile/bespoke-graphview)

# bespoke-graphview

Use svg to focus and display a text next to it

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/ideabile/bespoke-graphview/master/dist/bespoke-graphview.min.js
[max]: https://raw.github.com/ideabile/bespoke-graphview/master/dist/bespoke-graphview.js

## Usage

This plugin is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
  graphview = require('bespoke-graphview');

bespoke.from('#presentation', [
  graphview()
]);
```

When using browser globals:

```js
bespoke.from('#presentation', [
  bespoke.plugins.graphview()
]);
```

## Package managers

### npm

```bash
$ npm install bespoke-graphview
```

### Bower

```bash
$ bower install bespoke-graphview
```

## Credits

This plugin was built with [generator-bespokeplugin](https://github.com/markdalgleish/generator-bespokeplugin).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
