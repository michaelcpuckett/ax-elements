import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: contents;
    }
    [data-el="region"] {
      display: grid;
      grid-gap: var(--ax-spacing, 1em);
    }
    :host(:not([ax-internal-level="1"]):not([ax-internal-level="2"])) [data-el="region"] {
      border: 1px solid;
      padding: var(--ax-spacing, 1em);
    }
    [data-el="headline"] {
      display: grid;
    }
    [data-el="headline"][aria-level="1"] {
      font-weight: bold;
      font-size: xx-large;
    }
    [data-el="headline"][aria-level="2"] {
      font-weight: bold;
      font-size: x-large;
      border-bottom: 1px solid;
    }
    [data-el="headline"][aria-level="3"] {
      font-weight: bold;
      font-size: large;
    }
    [data-el="headline"][aria-level="4"] {
      justify-self: flex-start;
      border-bottom: 1px solid;
    }
  </style>
  <ax-view
    data-el="region"
    part="region"
    role="main"
    aria-labelledby="headline">
    <span
      role="heading"
      aria-level="1"
      id="headline"
      data-el="headline"
      part="headline">
      <slot
        data-el="headline-slot"
        name="headline">
        Untitled
      </slot>
    </span>
    <ax-view
      data-el="content">
      <slot></slot>
    </ax-view>
  </ax-view>
`
window.document.body.append(template)
export default class AXLandmark extends AXElement {
  constructor() {
    super(template)
    if (!this.hasAttribute('ax-internal-level')) {
      this.setAttribute('ax-internal-level', '1')
    }
    if (!this.hasAttribute('ax-internal-role')) {
      this.setAttribute('ax-internal-role', 'main')
    }
    this._regionEl = this.shadowRoot.querySelector('[data-el="region"]')
    this._headlineEl = this.shadowRoot.querySelector('[data-el="headline"]')
    this._headlineSlotEl = this.shadowRoot.querySelector('[data-el="headline-slot"]')
  }

  get nextRole() {
    if (!this.getAttribute('ax-section')) {
      switch (this.getAttribute('ax-internal-role')) {
        case 'main': return 'section'
        default: return 'region'
      }
    }
    switch (this.getAttribute('ax-section')) {
      case 'main': return 'section'
      default: return 'region'
    }
  }

  get nextLevel() {
    return `${parseInt(this.getAttribute('ax-heading-level') || 1, 10) + 1}`
  }

  connectedCallback() {
    setTimeout(() => {
      ;[...this.querySelectorAll('ax-landmark')].forEach(el => {
        el.setAttribute('ax-internal-role', this.nextRole)
        el.setAttribute('ax-internal-level', this.nextLevel)
      })
      if (this.getAttribute('ax-section') === 'navigation') {
        ;[...this.querySelectorAll('*:not(ax-link):not(ax-view):not(ax-text)')].forEach(el => {
          el.remove()
        })
      }
    })
  }

  static get observedAttributes() {
    return [
      'ax-name',
      'ax-section',
      'ax-internal-level',
      'ax-internal-role',
      'inert'
    ]
  }

  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-name': {
        this._headlineSlotEl.innerText = value
      }
      break
      case 'ax-section': {
        if (value) {
          this._regionEl.setAttribute('role', value)
        } else {
          this._regionEl.setAttribute('role', this.getAttribute('ax-internal-role')) // defaultRole?
        }
        setTimeout(() => {
          ;[...this.querySelectorAll('ax-landmark')].forEach(el => {
            if (!el.hasAttribute('ax-internal-role')) {
              el.setAttribute('ax-internal-role', this.nextRole)
            }
          })
        })
      }
      break
      case 'ax-internal-role': {
        if (!this.hasAttribute('ax-section')) {
          if (value) {
            this._regionEl.setAttribute('role', value)
          } else {
            this._regionEl.setAttribute('role', 'region')
          }
          setTimeout(() => {
            ;[...this.querySelectorAll('ax-landmark')].forEach(el => el.setAttribute('ax-internal-role', this.nextRole))
          })
        }
      }
      break
      case 'ax-internal-level': {
        this._headlineEl.setAttribute('aria-level', value)
        setTimeout(() => {
          ;[...this.querySelectorAll('ax-landmark')].forEach(el => el.setAttribute('ax-internal-level', `${parseInt(value, 10) + 1}`))
        })
      }
      break
      case 'inert': {
        if (value || value === '') {
          this._regionEl.setAttribute('aria-hidden', 'true')
          this.setAttribute('tabindex', '-1')
        } else {
          this._regionEl.removeAttribute('aria-hidden')
          this.removeAttribute('tabindex')
        }
      }
      break
      default: return
    }
  }
}
window.customElements.define('ax-landmark', AXLandmark)