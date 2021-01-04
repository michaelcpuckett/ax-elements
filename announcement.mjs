import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      position: absolute;
      width: 1px;
      height: 1px;
      white-space: nowrap;
      clip: rect(0 0 0 0);
      margin: -1px;
      overflow: hidden;
    }
  </style>
  <slot></slot>
`
window.document.body.append(template)
window.customElements.define('ax-announcement', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'status'
  }

  static get observedAttributes() {
    return [
      'ax-say'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-say': {
        if (value && !prev) {
          const spanEl = window.document.createElement('span')
          spanEl.setAttribute('data-el', 'saying')
          spanEl.innerText = value
          this.append(spanEl)
          setTimeout(() => {
            this.removeAttribute('ax-say')
          }, 1000)
        } else if (!value) {
          const spanEl = this.querySelector('[data-el="saying"]')
          if (spanEl) {
            spanEl.remove()
          }
        }
      }
      break
      default: return
    }
  }
})