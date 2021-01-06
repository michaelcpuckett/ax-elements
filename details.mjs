import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: contents;
    }
    [data-el="summary"] {
      display: grid;
    }
  </style>
  <ax-button
    id="summary"
    data-el="summary"
    ax-no-appearance
    aria-controls="region"
    aria-expanded="false">
    <slot name="ax-summary"></slot>
  </ax-button>
  <ax-view
    hidden
    tabindex="-1"
    role="region"
    id="region"
    aria-labelledby="summary"
    data-el="region">
    <slot></slot>
  </ax-view>
`
window.document.body.append(template)
window.customElements.define('ax-details', class extends AXElement {
  constructor() {
    super(template)
    this._regionEl = this.shadowRoot.querySelector('[data-el="region"]')
    this._summaryEl = this.shadowRoot.querySelector('[data-el="summary"]')
    if (this.hasAttribute('ax-open')) {
      this._summaryEl.setAttribute('aria-expanded', 'true')
    }
    this._summaryEl.addEventListener('click', () => {
      if (this.hasAttribute('ax-open')) {
        this.removeAttribute('ax-open')
      } else {
        this.setAttribute('ax-open', '')
      }
    })
  }
  connectedCallback() {
    this._summarySlotEl = this.querySelector('ax-summary')
    if (!this._summarySlotEl) {
      this.remove()
      throw new Error('AXDetailsError', {
        message: 'Summary not provided'
      })
    }
    this._summarySlotEl.setAttribute('slot', 'ax-summary')
  }
  static get observedAttributes() {
    return [
      'ax-open'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-open': {
        if (value || value === '') {
          this._regionEl.removeAttribute('hidden')
          this._summaryEl.setAttribute('aria-expanded', 'true')
        } else {
          this._regionEl.setAttribute('hidden', '')
          this._summaryEl.setAttribute('aria-expanded', 'false')
        }
      }
      break
      default: return
    }
  }
})