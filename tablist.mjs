import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: grid;
      grid-auto-flow: column;
    }
  </style>
  <slot name="ax-tab"></slot>
  <slot></slot>
`
window.document.body.append(template)

window.customElements.define('ax-tablist', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'tablist'
  }
  connectedCallback() {
    const children = [...this.children]
    this._tabSlotEls = children.filter(el => el.matches('ax-tab'))
    if (!this._tabSlotEls.length) {
      this.remove()
      throw new Error('AXTabsError', {
        message: 'Tabpanels not provided'
      })
    }
    this._tabSlotEls.forEach((el, i) => {
      if (i === 0) {
        el.setAttribute('ax-active', '')
      }
      el.setAttribute('slot', 'ax-tab')
    })
  }
})