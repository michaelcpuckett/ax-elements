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
        const submitEvent = new Event('submit', {
          cancelable: true
        })
        this.dispatchEvent(submitEvent)
        if (!submitEvent.defaultPrevented) {
          const actionURL = this.getAttribute('action')
          if (actionURL) {
            const method = this.getAttribute('method') || 'POST'
            const url = new URL(actionURL, window.document.location)
            Object.entries(this.formData).forEach(([ name, value ]) => {
              url.searchParams.set(name, value)
            })
            fetch(`${url}`, {
              method,
              headers: {
                'Content-Type': 'application/json'
              },
              ...method === 'POST' ? {
                body: JSON.stringify(this.formData)
              } : null
            })
            .then(res => {
              if (res.ok) {
                return res.json()
              } else {
                throw new Error(res.status)
              }
            })
            .then(result => {
              this.dispatchEvent(new CustomEvent('load', {
                detail: result
              }))
            })
            .catch(error => {
              this.dispatchEvent(new CustomEvent('error', {
                detail: error
              }))
            })
          }
        }
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