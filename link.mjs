import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      color: var(--ax-interactive-color);
      text-decoration: underline;
      cursor: pointer;
    }
  </style>
  <slot></slot>
`

window.document.body.append(template)

window.customElements.define('ax-link', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'link'
    this.tabIndex = '0'
    this.addEventListener('click', event => {
      if (!event.defaultPrevented) {
        window.location.assign(this.getAttribute('ax-url'))
      }
    })
    this.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.dispatchEvent(new Event('click'))
      }
    })
  }
  static get observedAttributes() {
    return [
      'ax-url'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-url': {
        if (!value) {
          this.remove()
          throw new Error('AXLinkError', {
            message: 'ax-url attribute is required'
          })
        }
      }
      break
      default: return
    }
  }
})