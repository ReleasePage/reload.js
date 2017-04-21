const semver = require('semver');
const defaults = require('lodash.defaults');

const diffDefaults = {
  autorefresh: -1, // do not autorefresh
  content: 'A new version is available!'
};

const globalDefaults = {
  versionjs: window.version,
  major: {},
  minor: {},
  patch: {},
  interval: 60 * 1000 // 60 seconds by default
};

const Reload = function () {
  this.opts = globalDefaults;
};

Reload.prototype = {
  options(opts) {
    this.diffDefaults = diffDefaults;
    this.opts = defaults(opts, globalDefaults);
    if (this.opts.content) {
      this.diffDefaults.content = this.opts.content;
    } else if (this.opts.html) {
      this.diffDefaults.html = this.opts.html;
    }
    if (this.opts.autorefresh) {
      this.diffDefaults.autorefresh = this.opts.autorefresh;
    }
    if (this.opts.versionjs) {
      this.start();
    }
    return this;
  },

  start() {
    if (this.interval) return this;
    this.opts.versionjs.bind('load', () => {
      this.update(this.opts.versionjs.tag({ repo: this.opts.repo }));
      this.poll();
    });
    // check for new version every 20 seconds
    this.poll();
    return this;
  },

  poll() {
    this.interval = setTimeout(() => {
      this.opts.versionjs.load();
    }, this.opts.interval);
  },

  stop() {
    clearInterval(this.interval);
    this.interval = null;
    return this;
  },

  update(version) {
    if (!this.opts.version) {
      this.opts.version = version;
    } else if (version !== this.opts.version) {
      // version has changed
      this.changed(version);
    }
    return this;
  },

  changed(newVersion) {
    const oldVersion = this.opts.version;
    const releaseDiff = semver.diff(oldVersion, newVersion);
    this.opts.version = newVersion;
    if (this.opts[releaseDiff]) {
      this.render(this.opts[releaseDiff]);
    }
    return this;
  },

  render(opts = {}) {
    if (this.$el) return this;
    const options = defaults(opts, this.diffDefaults);
    const $el = document.createElement('div');
    this.$el = $el;
    $el.className = 'reloadjs';
    let $content;
    let $refreshBtnTime;

    if (options.html) {
      $content = options.html;
    } else {
      // create the contents of the popover
      $content = document.createElement('div');
      $content.className = 'reloadjs__content';
      const $text = document.createElement('span');
      $text.textContent = (typeof options.content === 'function')
        ? options.content(this.opts.version)
        : options.content;
      $content.appendChild($text);
      const $refreshBtn = document.createElement('a');
      $refreshBtn.textContent = 'Refresh';
      $refreshBtn.className = 'reloadjs__refresh-btn';
      $refreshBtn.addEventListener('click', () => window.location.reload());
      if (options.autorefresh > 0) {
        if (options.showCountdown) {
          $refreshBtnTime = document.createElement('span');
          $refreshBtnTime.className = 'reloadjs__countdown';
          $refreshBtnTime.textContent = `(${options.autorefresh})`;
          $refreshBtn.appendChild($refreshBtnTime);
        }
        const $loader = document.createElement('span');
        $loader.className = 'reloadjs__countdown-loader';
        $loader.style.transition = `width ${options.autorefresh}s linear`;
        $el.appendChild($loader);
      }
      $content.appendChild($refreshBtn);
    }
    if (typeof $content === 'string') {
      $el.innerHTML = $content;
    } else {
      $el.appendChild($content);
    }

    document.body.appendChild($el);
    // wait a second for everything to be ready
    setTimeout(() => {
      $el.className += ' reloadjs--ready';
      if (options.autorefresh === 0) {
        // refresh immediately if set to 0
        window.href.reload();
      } else if (options.autorefresh > 0) {
        // refresh after a period if set
        let countdown = options.autorefresh;
        if (options.showCountdown) {
          setInterval(() => {
            countdown -= 1;
            $refreshBtnTime.textContent = `(${countdown})`;
          }, 1000);
        }
        setTimeout(() => {
          window.location.reload();
        }, options.autorefresh * 1000);
      }
    }, 1000);

    return this.stop();
  }
};

const reload = new Reload();

if (module) {
  module.exports = reload;
}
if (typeof window !== 'undefined') {
  window.reload = reload;
}
