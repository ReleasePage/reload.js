# reload.js

<div>
  <a href="https://www.bithound.io/github/ReleasePage/reload.js">
    <img src="https://www.bithound.io/github/ReleasePage/reload.js/badges/score.svg" alt="bitHound Overall Score">
  </a>

  <a href="https://circleci.com/gh/ReleasePage/reload.js">
    <img src="https://circleci.com/gh/ReleasePage/reload.js.svg?style=shield&circle-token=e81abb767be091a83e8675d74a2171d557d45e5d" alt="Build Status"/>
  </a>

  <a href="http://reloadjs.releasepage.co">
    <img src="http://api.releasepage.co/v1/pages/7fa436a3-cdc2-4047-add0-b5a216a75bd0/badge.svg?apiKey=live.x7izhEzWeaeKRepW" alt="Latest Release">
  </a>

  <br/>
  <br/>
</div>

`reload.js` will show a popup or refresh your app when there is a new GitHub version released ⚡️

---

[Basic Demo][1]

<img width="624" alt="screen shot 2017-04-21 at 15 13 06" src="https://cloud.githubusercontent.com/assets/1462828/25269006/18d9f37e-26a5-11e7-87b7-ce79d0b50892.png">

---

- [Installation](#installation)
- [Customisation](#customisation)
  - [Messages](#messages)
  - [Versions](#versions)
  - [Force Refresh](#force-refresh)
  - [Custom HTML](#custom-html)
- [ReleasePage Integration](#releasepage-integration)
  - [Specific project](#specific-project)
- [AMD](#amd)

## Installation

`reload.js` uses the [`version.js`][4] library to fetch your release versions, so you must include both libraries.

Provide the GitHub repository that you want to use as a `data-repo` attribute in the script tag. When a new version of the repository is released, `reload.js` will show a customisable popup and optionally refresh the page.


```html
<script src="//cdn.releasepage.co/js/version.js" data-repo="releasepage/version"></script>
<script src="//cdn.releasepage.co/js/reload.js"></script>
```

Or we also provide a combined library on our CDN for convenience.

```html
<script src="//cdn.releasepage.co/js/reload.combined.js" data-repo="releasepage/version"></script>
```

If you want to use our default styles then also include `reload-basic.css`, this is what we use on [ReleasePage][3] and on the [basic demo][1].

```html
<link rel="stylesheet" type="text/css" href="//cdn.releasepage.co/css/reload-basic.css">
```

`reload.js` exposes `window.reload` so you can use the following customisation options.

## Customisation

### Interval

`reload.js` will check GitHub for new release information every 60 seconds. If you want to change this then pass an `interval` argument:

```js
reload.options({
  interval: 10000 // 10 seconds
});
```

Note; Requests to GitHub's API are [rate limited per IP address][8], allowing 60 requests per hour. Bear this in mind when setting the interval.

If you need a higher rate-limit, take a look at using `reload.js` as a [ReleasePage Integration](#releasepage-integration).

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

### Force Refresh

Sometimes you want to force the user to refresh if there are big breaking changes 💥 (passing `0` will show the popup then force refresh immediately).

```js
reload.options({
  major: {
    content: 'A new version is available!',
    autorefresh: 30 // seconds
  }
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

## ReleasePage Integration

`reload.js` can also be used as a ReleasePage integration allowing you to take advantage of extra cool features:

- Private repos
- Group releases from different repos into one combined version
- A more generous rate limit

### Enable API access

If you don't have an account yet, you can create one [on our homepage][3]. After creating your first beautiful Release Page, you need to grab your API key.

Learn more about ReleasePage API keys [here][7].

### Installation

To use `reload.js` with your Release Page, provide the page ID and you API Key instead of a GitHub repo

```html
<script src="//cdn.releasepage.co/js/reload.combined.js" data-api-key="<API_KEY>" data-page-id="<PAGE_ID>"></script>
```

### Specific Project

If you only want to show the popup for a version change of a specific project from the Release Page.

```js
reload.options({
  repo: 'releasepage/api'
});
```

## AMD

We also provide an AMD module for use with npm and webpack et al.

```npm install release-page-version release-page-reload --save-dev```

```js
const version = require('release-page-version');
const reload = require('release-page-reload');

// set up `version.js` using the GitHub API
version.options({
  github: {
    repo: REPO_NAME
  }
});

// ...or set up `version.js` using the ReleasePage API
version.options({
  pageId: RP_PAGE_ID,
  apiKey: RP_API_KEY
});

reload.options({
  // tell reload to use this `version.js` instead of the one on `window`
  versionjs: version,
  major: {
    content: 'A new version is available!'
  }
});

```

[1]: http://codepen.io/Jivings/pen/yMmLde
[3]: https://releasepage.co
[4]: https://github.com/ReleasePage/version.js
[5]: https://github.com/npm/node-semver
[6]: https://github.com/npm/node-semver#comparison
[7]: https://help.releasepage.co/api
[8]: https://developer.github.com/v3/#rate-limiting