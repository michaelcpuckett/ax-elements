import AXButton from './button.mjs'

window.customElements.define('ax-summary', class extends AXButton {
  constructor() {
    super()
    this.setAttribute('ax-no-appearance', '')
    this.ariaExpanded = 'false'
    this.addEventListener('click', () => {
      if (this.hasAttribute('ax-internal-expanded')) {
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
      'ax-internal-expanded'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-internal-expanded': {
        if (value || value === '') {
          this.ariaExpanded = 'true'
        } else {
          this.ariaExpanded = 'false'
        }
      }
      break
      default: return
    }
  }
})