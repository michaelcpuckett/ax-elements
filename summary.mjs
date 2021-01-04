import AXElement from './element.mjs'
const template = window.document.createElement('template')
template.innerHTML = `
  <slot></slot>
`
window.document.body.append(template)
export default class AXSummary extends AXElement {
  constructor() {
    super(template)
  }
}

window.customElements.define('ax-summary', AXSummary)