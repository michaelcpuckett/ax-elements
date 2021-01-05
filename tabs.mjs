import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: grid;
    }
  </style>
  <slot name="ax-tablist"></slot>
  <slot name="ax-tabpanel"></slot>
  <slot></slot>
`
window.document.body.append(template)

window.customElements.define('ax-tabs', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'tabs'
  }
  connectedCallback() {
    const children = [...this.children]
    this._tablistSlotEl = children.find(el => el.matches('ax-tablist'))
    this._tabpanelSlotEls = children.filter(el => el.matches('ax-tabpanel'))
    if (!this._tablistSlotEl) {
      this.remove()
      throw new Error('AXTabsError', {
        message: 'Tablist not provided'
      })
    }
    if (!this._tabpanelSlotEls.length) {
      this.remove()
      throw new Error('AXTabsError', {
        message: 'Tabpanels not provided'
      })
    }
    this._tablistSlotEl.setAttribute('slot', 'ax-tablist')
    this._tabpanelSlotEls.forEach((el, i) => {
      if (i !== 0) {
        el.setAttribute('hidden', '')
      }
      el.setAttribute('slot', 'ax-tabpanel')
    })
  }
})