import semver from 'semver';
import _defaults from 'lodash.defaults';

const defaults = {
  autorefresh: -1,
  content: 'A new version is available!'
};

const Reload = function (options = {}) {
  this.options = options;
  this.options.version = localStorage.getItem('reload-prev-version');

  window.version.bind('load', () => {
    console.log('loaded version');
    this.update(window.version.tag());
  });
  // check for new version every 20 seconds
  setInterval(() => {
    window.version.load();
  }, 5000);
};

Reload.prototype = {
  update(version) {
    console.log(`updating version to ${version}`);
    if (!this.options.version) {
      this.options.version = version;
      localStorage.setItem('reload-prev-version', version);
    } else if (version !== this.options.version) {
      this.changed(version);
    }
    return this;
  },

  changed(newVersion) {
    const oldVersion = this.options.version;
    const releaseDiff = semver.diff(oldVersion, newVersion);
    if (this.options.release[releaseDiff]) {
      this.render(this.options.release[releaseDiff]);
    }
    return this;
  },

  render(opts = {}) {
    if (this.$el) return this;
    const options = _defaults(opts, defaults);
    const $el = this.$el = document.createElement('div');
    $el.className = 'reloadjs';
    let $content;
    let $refreshBtnTime;
    let $refreshBtn;
    if (options.html) {
      $content = options.html;
    } else {
      // create the contents of the popover
      $content = document.createElement('div');
      $content.className = 'reloadjs__content';
      const $text = document.createElement('span');
      $text.textContent = options.content;
      $content.appendChild($text);
      $refreshBtn = document.createElement('a');
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
    $el.appendChild($content);
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
            countdown = countdown - 1;
            $refreshBtnTime.textContent = `(${countdown})`;
          }, 1000);
        }
        setTimeout(() => {
          window.location.reload();
        }, options.autorefresh * 1000);
      }
    }, 1000);


    return this;
  }
};

window.Reload = Reload;
