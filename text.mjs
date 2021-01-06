import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <slot></slot>
`
window.document.body.append(template)
export default class AXText extends AXElement {
  constructor() {
    super(template)
    if (!this.hasAttribute('role')) {
      this.role = 'presentation'
    }
  }
}
window.customElements.define('ax-text', AXText)