(function(exports) {

  const ELEMENT_NAME = 'aria-tabs';
  const SELECTED = 'aria-selected';
  const CONTROLS = 'aria-controls';
  const TAB_NAME = 'data-name';
  const TOGGLE_EVENTS = ['click', 'focus', 'keydown'];
  const HTMLParsedElement = require('./html-parsed-element');

  exports.customElements.define(
    ELEMENT_NAME,
    class extends HTMLParsedElement {

      parsedCallback() {
        const tabs = this.getTabs(this);
        if (!tabs.length) {
          return;
        }

        this.renderTabs(this, tabs);
        this.__tabs = [...this.querySelectorAll('[role="tab"]')];
        this.__panels = [...this.querySelectorAll('[role="tabpanel"]')];
        this.bindCallbacks(this);
        this.initEventHandlers(this);
        this.__direction = {
          'ArrowLeft': -1,
          'ArrowUp': -1,
          'ArrowRight': 1,
          'ArrowDown': 1
        }
      }

      disconnectedCallback() {
        this.__tabs.forEach((tab) => {
          tab.removeEventListener('click', this.__boundOnClick, true);
          tab.removeEventListener('focus', this.__boundOnFocus, true);
          tab.removeEventListener('keydown', this.__boundOnKeyDown, true);
        })
      }

      update() { }

      getTabs(root) {
        const selector = root.getAttribute('tabs') || `[${TAB_NAME}]`;
        const tabs = [...root.querySelectorAll(selector)];
        if (!tabs.length) {
          console.warn('no tabs found for selector: "' + selector + '"');
          return;
        }
        return tabs;
      }

      renderTabs(root, tabs) {

        const tabList = document.createElement('div');
        root.insertBefore(tabList, root.firstElementChild);
        tabList.className="tablist";
        tabList.setAttribute('role', 'tablist');
        let lastTabBtn = null;

        tabs.forEach((tabPanel, index) => {
          let tabBtn = document.createElement('button');
          let tabName = tabPanel.getAttribute(TAB_NAME);
          let tabId = `${ELEMENT_NAME}-${index}`;

          tabBtn.setAttribute('id', tabId);
          tabBtn.setAttribute('role', 'tab');
          tabBtn.setAttribute(SELECTED, this.getAriaBoolean(tabPanel, SELECTED));
          tabBtn.setAttribute('tabindex', this.getAriaBoolean(tabPanel, SELECTED) ? '0' : '-1' );
          tabBtn.setAttribute(CONTROLS, `${tabId}-tab`);
          tabBtn.className = 'tab-item';
          tabBtn.innerHTML = tabName;

          tabPanel.setAttribute('id', `${tabId}-tab`);
          tabPanel.setAttribute('role', 'tabpanel');
          tabPanel.setAttribute('arialabelledby', tabId);
          if (!this.getAriaBoolean(tabPanel, SELECTED)) {
            tabPanel.setAttribute('aria-hidden', 'true');
          }
          tabPanel.removeAttribute(SELECTED);
          tabBtn.index = index;

          if (lastTabBtn !== null) {
            lastTabBtn = lastTabBtn.nextElementSibling;
          }

          tabList.insertBefore(tabBtn, lastTabBtn);
          lastTabBtn = tabBtn;
        })

      }

      bindCallbacks() {
        this.__boundOnClick   = this._onClick.bind(this);
        this.__boundOnFocus   = this._onFocus.bind(this);
        this.__boundOnKeyDown = this._onKeyDown.bind(this);
      }

      initEventHandlers() {
        this.__tabs.forEach((tab) => {
          tab.removeEventListener('click', this.__boundOnClick, true);
          tab.addEventListener('click', this.__boundOnClick, true);
          tab.removeEventListener('focus', this.__boundOnFocus, true);
          tab.addEventListener('focus', this.__boundOnFocus, true);
          tab.removeEventListener('keydown', this.__boundOnKeyDown, true);
          tab.addEventListener('keydown', this.__boundOnKeyDown, true);
        });
      }

      _onClick(event) {
        this._activateTab(event.currentTarget);
        event.preventDefault();
      }

      _onFocus(event) {
        if(this.getAriaBoolean(event.target, SELECTED) !== 'true') this._activateTab(event.target);
      }

      _onKeyDown(event) {
        switch (event.key) {
          case "ArrowRight":
          case "ArrowLeft":
            this._switchTabOnArrowPress(event);
            break;
          case "ArrowUp":
          case "ArrowDown":
            event.preventDefault();
            this._switchTabOnArrowPress(event);
            break;
        }
      }

      // Either focus the next, previous, first, or last tab
      // depending on key pressed
      _switchTabOnArrowPress(event) {
        const pressed = event.key;
        const target = event.target;
        if (this.__direction[pressed]) {
          if (target.index !== undefined) {
            if (this.__tabs[target.index + this.__direction[pressed]]) {
              this.__tabs[target.index + this.__direction[pressed]].focus();
            }
            else if (pressed === "ArrowLeft" || pressed === "ArrowUp") {
              this.__tabs[0] && this.__tabs[this.__tabs.length - 1].focus();
            }
            else if (pressed === "ArrowRight" || pressed === "ArrowDown") {
              this.__tabs[0] && this.__tabs[0].focus();
            }
          }
        }
      }

      _activateTab(tab) {
        if(!tab) return;
        this._deactivateTabs();
        tab.removeAttribute('tabindex');
        tab.setAttribute(SELECTED, true);
        let panel = document.getElementById(`${tab.getAttribute(CONTROLS)}`);
        panel.removeAttribute('aria-hidden');
        panel.setAttribute('tabindex', 0)
      }

      _deactivateTabs() {
        this.__tabs.forEach((tab, i) => {
          tab.setAttribute('tabindex', '-1');
          tab.setAttribute(SELECTED, false);
        });

        this.__panels.forEach((panel, i) => {
          panel.setAttribute('aria-hidden', true);
          panel.setAttribute('tabindex', '-1');
        });
      }

      getAriaBoolean(el, attr) {
        return el && el.hasAttribute(attr) && el.getAttribute(attr) !== 'false';
      }
    }

  );

})(window);
