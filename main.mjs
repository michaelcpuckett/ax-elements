import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <h1
    id="title"
    data-el="title">
  </h1>
  <slot></slot>
`
window.document.body.append(template)
window.customElements.define('ax-main', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'main'
    this.ariaLabelledBy = 'title'
  }

  static get observedAttributes() {
    return [
      'ax-title',
      'inert'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-title': {
        this.shadowRoot.querySelector('[data-el="title"]').innerText = value
      }
      break
      case 'inert': {
        if (value === 'true' || value === 'inert' || value === '') {
          this.ariaHidden = true
          this.tabIndex = '-1'
        } else {
          this.ariaHidden = false
          this.removeAttribute('tabindex')
        }
      }
      break
      default: return
    }
  }
})