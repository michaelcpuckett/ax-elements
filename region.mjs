import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: contents;
    }
    [data-el="title"] {
      margin: 1em 0;
      font-weight: bold;
      display: block;
    }
    [data-el="title"][aria-level="1"] {
      font-size: xx-large;
    }
    [data-el="title"][aria-level="2"] {
      font-size: x-large;
    }
    [data-el="title"][aria-level="3"] {
      font-size: large;
    }
  </style>
  <div
    data-el="region"
    role="region"
    aria-labelledby="title">
    <span
      role="heading"
      aria-level="1"
      id="title"
      data-el="title">
      <slot
        data-el="title-slot"
        name="title">
        Untitled
      </slot>
    </span>
    <slot></slot>
  </div>
`
window.document.body.append(template)
export default class AXRegion extends AXElement {
  constructor() {
    super(template)
    this.setAttribute('ax-heading-level', '1')
    this._regionEl = this.shadowRoot.querySelector('[data-el="region"]')
    this._titleEl = this.shadowRoot.querySelector('[data-el="title"]')
    this._titleSlotEl = this.shadowRoot.querySelector('[data-el="title-slot"]')
  }

  connectedCallback() {
    setTimeout(() => {
      ;[...this.querySelectorAll('[ax-heading-level]')].forEach(el => el.setAttribute('ax-heading-level', `${parseInt(this.getAttribute('ax-heading-level'), 10) + 1}`))
    })
  }

  static get observedAttributes() {
    return [
      'ax-title',
      'ax-heading-level'
    ]
  }

  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-title': {
        this._titleSlotEl.innerText = value
      }
      break
      case 'ax-heading-level': {
        this._titleEl.setAttribute('aria-level', value)
        setTimeout(() => {
          ;[...this.querySelectorAll('[ax-heading-level]')].forEach(el => el.setAttribute('ax-heading-level', `${parseInt(value, 10) + 1}`))
        })
      }
      break
      default: return
    }
  }
}
window.customElements.define('ax-region', AXRegion)