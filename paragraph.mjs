import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: block;
    }
  </style>
  <slot></slot>
`
window.document.body.append(template)
export default class AXParagraph extends AXElement {
  constructor() {
    super(template)
    this.role = 'paragraph'
  }
}
window.customElements.define('ax-paragraph', AXParagraph)