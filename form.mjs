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
window.customElements.define('ax-form', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'form'
    this.addEventListener('ax-submit', () => {
      const allFields = [...this.querySelectorAll('[ax-name]')]
        .map(el => ({
          name: el.getAttribute('ax-name'),
          value: el.getAttribute('ax-value') || ''
        }))
      const validFields = Object.fromEntries(
        [...this.querySelectorAll('[ax-value]')]
          .filter(el => !el.getAttribute('ax-internal-invalid'))
          .map(el => [
            el.getAttribute('ax-name'),
            el.getAttribute('ax-value') || ''
          ])
      )
      if (Object.keys(validFields).length === allFields.length) {
        this.formData = {
          ...validFields
        }
        this.dispatchEvent(new Event('submit'))
      } else {
        allFields.forEach(({ name }) => {
          if (!validFields[name]) {
            this.querySelector(`[ax-name="${name}"]`).dispatchEvent(new Event('invalid'))
          }
        })
        this.formData = null
        this.dispatchEvent(new Event('invalid'))
      }
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