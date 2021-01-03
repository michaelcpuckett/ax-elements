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
      const allFieldEls = [...this.querySelectorAll('[ax-value]')]
      const fieldsElsWithValidation = [...this.querySelectorAll('[ax-required]')]
      const invalidFields = fieldsElsWithValidation.filter(el => el.hasAttribute('ax-internal-invalid'))

      if (invalidFields.length) {
        invalidFields.forEach(el => {
          el.dispatchEvent(new Event('invalid'))
        })
        this.formData = null
        this.dispatchEvent(new Event('invalid'))
      } else {
        this.formData = Object.fromEntries(
          allFieldEls
            .map(el => [
              el.getAttribute('ax-name'),
              el.getAttribute('ax-value') || ''
            ])
        )
        this.dispatchEvent(new Event('submit'))
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