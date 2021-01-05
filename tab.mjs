import AXButton from './button.mjs'

window.customElements.define('ax-tab', class extends AXButton {
  constructor() {
    super()
    this.role = 'tab'
    // this.setAttribute('ax-no-appearance', '')
  }
})