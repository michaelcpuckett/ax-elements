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
window.customElements.define('ax-grid', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'grid'
  }

  connectedCallback() {
    this.querySelector('ax-cell').setAttribute('ax-active', '')
  }

  static get observedAttributes() {
    return [
      'ax-title'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-title': {
        this.ariaLabel = value
      }
      break
      default: return
    }
  }
})