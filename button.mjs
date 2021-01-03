import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      --color: var(--ax-color, var(--ax-interactive-color));
      --background-color: var(--ax-background-color, var(--ax-interactive-background-color));
      cursor: pointer;
      display: inline-grid;
      grid-auto-flow: column;
      align-items: center;
      padding: var(--padding, 4px 8px);
      color: var(--color, inherit);
      background-color: var(--background-color, transparent);
      border-color: var(--ax-border-color, var(--color));
      border-radius: var(--ax-border-radius, 0);
      border-width: var(--ax-border-width, 2px);
      border-style: solid;
      outline: 0;
      font-size: var(--ax-font-size, inherit);
      line-height: var(--ax-line-height, 1);
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    :host([size="small"]) {
      padding: var(--ax-padding, 2px 4px);
      font-size: var(--ax-font-size, smaller);
    }
    :host([size="large"]) {
      padding: var(--ax-padding, 8px 12px);
      font-size: var(--ax-font-size, larger);
    }
    :host(:focus) {
      outline: 4px solid var(--ax-focus-color, #63ADE5);
    }
    :host(:focus:focus-visible) {
      outline: 0;
    }
    :host(:focus-visible) {
      box-shadow: 0 0 0 4px var(--ax-focus-color, #63ADE5);
    }
    :host(:hover) {
      filter: var(--color, contrast(0) sepia(1) hue-rotate(45deg));
      background-color: var(--color, transparent);
      color: var(--background-color, currentColor);
    }
  </style>
  <slot name="label"></slot>
  <slot name="icon"></slot>
`
window.document.body.append(template)
window.customElements.define('ax-button', class extends AXElement {
  constructor() {
    super(template)
    this.tabIndex = '0'
    this.role = 'button'
    this.addEventListener('keydown', ({ key }) => {
      if (key === 'Enter' || key === ' ') {
        this.dispatchEvent(new CustomEvent('click'))
      }
    })
  }

  static get observedAttributes() {
    return [
      'ax-label',
      'ax-icon',
      'ax-hide-label',
      'ax-open-dialog',
      'ax-submit',
      'ax-disabled',
      'disabled'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-label': {
        if (value) {
          this.ariaLabel = value
          this.shadowRoot.querySelector('slot[name="label"]').innerHTML = value
        } else {
          this.ariaLabel = null
          this.shadowRoot.querySelector('slot[name="label"]').innerHTML = ''
        }
      }
      break
      case 'ax-hide-label': {
        if (value === '') {
          this.shadowRoot.querySelector('slot[name="label"]').setAttribute('hidden', '')
        } else {
          this.shadowRoot.querySelector('slot[name="label"]').removeAttribute('hidden')
        }
      }
      break
      case 'ax-submit': {
        if (value === 'true' || value === '') {
          this._submitHandler = () => {
            this.closest('ax-form').dispatchEvent(new Event('submit'))
          }
          this.addEventListener('click', this._submitHandler)
        } else if (!value) {
          if (this._submitHandler) {
            this.removeEventListener('click', this._submitHandler)
            this._submitHandler = null
          }
        }
      }
      break
      case 'ax-disabled':
      case 'disabled': {
        if (value === '') {
          this.ariaDisabled = true
          this.tabIndex = '-1'
        } else {
          this.ariaDisabled = false
          this.tabIndex = null
        }
      }
      break
      case 'ax-open-dialog': {
        if (value) {
          this.ariaHasPopup = 'dialog'
          this._openDialogHandler = () => {
            const dialogEl = window.document.querySelector(`ax-dialog[ax-name="${value}"]`)
            if (dialogEl) {
              dialogEl.setAttribute('ax-open', '')
            }
          }
          this.addEventListener('click', this._openDialogHandler)
        } else if (prev && !value) {
          this.removeEventListener('click', this._openDialogHandler)
          this._openDialogHandler = null
          this.ariaHasPopup = null
        }
      }
      break
      case 'ax-icon': {
        if (value) {
          if (value.endsWith('.svg')) {
            return this.shadowRoot.querySelector('slot[name="icon"]').innerHTML = `
              <img src="${value}" role="presentation" />
            `
          } else {
            switch (value) {
              case 'close': {
                return this.shadowRoot.querySelector('slot[name="icon"]').innerHTML = `
                  <svg role="img" fill="none" stroke="currentColor" stroke-width="2"  viewBox="0 0 20 20" height="1em" width="1em">
                    <line x1="16" y1="4" x2="4" y2="16"></line>
                    <line x1="4" y1="4" x2="16" y2="16"></line>
                  </svg>
                `
              }
              default: return
            }
          }
        } else {
          this.shadowRoot.querySelector('slot[name="icon"]').innerHTML = ''
        }
      }
      default: return
    }
  }
})