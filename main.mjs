import AXRegion from './region.mjs'

export default class AXMain extends AXRegion {
  constructor() {
    super()
    this._regionEl.setAttribute('role', 'main')
  }

  static get observedAttributes() {
    return [
      ...super.prototype.constructor.observedAttributes,
      'inert'
    ]
  }

  attributeChangedCallback(attributeName, prev, value) {
    super.attributeChangedCallback(attributeName, prev, value)

    switch (attributeName) {
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

window.customElements.define('ax-main', AXMain)