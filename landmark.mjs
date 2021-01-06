import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: contents;
    }
    [data-el="region"] {
      border: 1px solid;
      padding: 1em;
      display: grid;
      grid-gap: 1em;
    }
    [data-el="headline"] {
      font-weight: bold;
      display: grid;
    }
    [data-el="headline"][aria-level="1"] {
      font-size: xx-large;
    }
    [data-el="headline"][aria-level="2"] {
      font-size: x-large;
    }
    [data-el="headline"][aria-level="3"] {
      font-size: large;
    }
  </style>
  <ax-view
    data-el="region"
    role="main"
    aria-labelledby="headline">
    <span
      role="heading"
      aria-level="1"
      id="headline"
      data-el="headline">
      <slot
        data-el="headline-slot"
        name="headline">
        Untitled
      </slot>
    </span>
    <slot></slot>
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
        case 'section': return 'article'
        default: return 'region'
      }
    }
    switch (this.getAttribute('ax-section')) {
      case 'main': return 'section'
      case 'section': return 'article'
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