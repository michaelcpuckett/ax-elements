import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <ax-button
    data-el="button">
    <slot></slot>
  </ax-button>
`
window.document.body.append(template)
window.customElements.define('ax-summary', class extends AXElement {
  constructor() {
    super(template)
    this._buttonEl = this.shadowRoot.querySelector('[data-el="button"]')
    this._buttonEl.addEventListener('click', () => {
      if (this.hasAttribute('ax-expanded')) {
        this._detailsEl.removeAttribute('ax-open')
      } else {
        this._detailsEl.setAttribute('ax-open', '')
      }
    })
  }
  connectedCallback() {
    this._detailsEl = this.closest('ax-details')
  }
  static get observedAttributes() {
    return [
      'ax-expanded'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-expanded': {
        if (value || value === '') {
          this._buttonEl.ariaExpanded = 'true'
        } else {
          this._buttonEl.ariaExpanded = 'false'
        }
      }
      break
      default: return
    }
  }
})