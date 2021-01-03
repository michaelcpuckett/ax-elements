import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: grid;
    }
  </style>
  <slot name="ax-summary"></slot>
  <div
    hidden
    tabindex="-1"
    role="region"
    id="region"
    data-el="region">
    <slot></slot>
  </div>
`
window.document.body.append(template)
window.customElements.define('ax-details', class extends AXElement {
  constructor() {
    super(template)
    this._regionEl = this.shadowRoot.querySelector('[data-el="region"]')
  }
  connectedCallback() {
    this._summaryEl = this.querySelector('ax-summary')
    this._summaryEl.setAttribute('slot', 'ax-summary')
    if (this.hasAttribute('ax-open')) {
      this._summaryEl.setAttribute('ax-internal-expanded', '')
    }
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
          if (this._summaryEl) {
           this._summaryEl.setAttribute('ax-internal-expanded', '')
          }
        } else {
          this._regionEl.setAttribute('hidden', '')
          if (this._summaryEl) {
            this._summaryEl.removeAttribute('ax-internal-expanded')
          }
        }
      }
      break
      default: return
    }
  }
})