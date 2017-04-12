# reload.js

<div>
  <a href="https://www.bithound.io/github/ReleasePage/reload.js">
    <img src="https://www.bithound.io/github/ReleasePage/reload.js/badges/score.svg" alt="bitHound Overall Score">
  </a>

  <a href="https://circleci.com/gh/ReleasePage/reload.js">
    <img src="https://circleci.com/gh/ReleasePage/reload.js.svg?style=shield&circle-token=e81abb767be091a83e8675d74a2171d557d45e5d" alt="Build Status"/>
  </a>

  <a href="http://reloadjs.releasepage.co">
    <img src="http://staging.api.releasepage.co/v1/pages/26a680a0-0f6d-41b2-854e-4ea2b134ad7e/badge.svg?apiKey=1234" alt="Latest Release">
  </a>

  <br/>
  <br/>
</div>

`reload.js` will show a popup or refresh your app when there is a new version released ⚡️

- [Basic Demo][1]

## Enable API access

First you need to grab your ReleasePage API key. Learn more about the ReleasePage API [here][7].

## Installation

`reload.js` uses the [`version.js`][4] library to fetch your release versions, so you must include both libraries.


```html
<script src="//cdn.releasepage.co/js/version.js" data-api-key="<API_KEY>" data-page-id="<PAGE_ID>" ></script>
<script src="//cdn.releasepage.co/js/reload.js"></script>
```

If you want to use our default styles then also include `reload-basic.css`, this is what we use on [ReleasePage][3].

```html
<link rel="stylesheet" type="text/css" href="//cdn.releasepage.co/css/reload-basic.css">
```

`reload.js` exposes `window.reload` so you can use the following customisation options.

## Customisation

### Messages
By default `reload.js` will show a popup when your version changes with a short message. You can customise the messages that will be displayed using the `options` function.

```js
reload.options({
  content: 'A new version is available!'
});

reload.options({
  content: (version) => `Version ${version} has been released!`
});
```

### Versions

You can also specify arguments for specific version changes. `reload.js` is built on [`semver`][5] so any changes supported by the [`diff`][6] function are supported (`major`, `premajor`, `minor`, `preminor`, `patch`, `prepatch`, or `prerelease`).

```js
reload.options({
  major: {
    content: 'A new version is available!'
  },
  minor: {
    content: 'Take a look at our new features'
  },
  patch: {
    content: 'Some bugs are fixed'
  }
});
```

By default a message box will only be shown for `major`, `minor` and `patch` changes.

If you don't want `reload.js` to do anything on `minor` or `patch` version changes then simply pass `false`

```js
reload.options({
  major: {
    content: 'A new version is available!'
  },
  minor: false,
  patch: false
});
```

### Force refresh

Sometimes you want to force the user to refresh if there are big breaking changes 💥 (passing `0` will show the popup then force refresh immediately).

```js
reload.options({
  major: {
    content: 'A new version is available!',
    autorefresh: 30 // seconds
  }
});
```

### Project

If you only want to show the popup for a version change of specific project from the Release Page.

```js
reload.options({
  repo: 'releasepage/api'
});
```

### Custom html

You can completely override the html inside the `reload.js` popup if you like ✌️

```js
const $contents = document.createElement('<div>');
$contents.innerText = 'New stuff!';

reload.options({
  html: $contents
});
```

[1]: http://codepen.io/Jivings/pen/yMmLde
[3]: https://releasepage.co
[4]: https://github.com/ReleasePage/version.js
[5]: https://github.com/npm/node-semver
[6]: https://github.com/npm/node-semver#comparison
[7]: https://help.releasepage.co/api