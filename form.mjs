import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <slot></slot>
`
window.document.body.append(template)
window.customElements.define('ax-form', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'form'
  }

  static get observedAttributes() {
    return [
      'ax-autocomplete'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      default: return
    }
  }
})