import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(:not([hidden])) {
      display: grid;
      grid-gap: var(--ax-spacing, 1em);
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