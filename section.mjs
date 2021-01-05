import AXRegion from './region.mjs'

export default class AXSection extends AXRegion {
  constructor() {
    super()
    this._regionEl.setAttribute('role', 'section')
  }
}

window.customElements.define('ax-section', AXSection)