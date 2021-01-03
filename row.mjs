import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: var(--ax-columns, minmax(0, 1fr));
    }
  </style>
  <slot></slot>
`
window.document.body.append(template)
window.customElements.define('ax-row', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'row'
  }
})