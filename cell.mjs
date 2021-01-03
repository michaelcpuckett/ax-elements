import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: grid;
    }
  </style>
  <slot></slot>
`
window.document.body.append(template)
window.customElements.define('ax-cell', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'cell'
    this.tabIndex = '-1'
  }
})