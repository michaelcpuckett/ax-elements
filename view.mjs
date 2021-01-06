import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(:not([hidden])) {
      display: grid;
    }
    :host([ax-inline]) {
      grid-auto-flow: column;
      justify-items: flex-start;
      grid-auto-columns: minmax(0, max-content);
      align-items: center;
      grid-column-gap: 1ch;
    }
  </style>
  <slot></slot>
`
window.document.body.append(template)
export default class AXView extends AXElement {
  constructor() {
    super(template)
    if (!this.hasAttribute('role')) {
      this.role = 'presentation'
    }
  }
}
window.customElements.define('ax-view', AXView)