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
    this.addEventListener('submit', () => {
      const formValues = Object.fromEntries([...this.querySelectorAll('[ax-value]')].map(el => [ el.getAttribute('ax-name'), el.getAttribute('ax-value') ]))
      console.log(formValues)
    })
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