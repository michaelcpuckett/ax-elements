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
      aria-level="2"
      id="title"
      data-el="title">
    </span>
    <slot></slot>
  </div>
`
window.document.body.append(template)
export default class AXRegion extends AXElement {
  constructor() {
    super(template)
    this._regionEl = this.shadowRoot.querySelector('[data-el="region"]')
    this._titleEl = this.shadowRoot.querySelector('[data-el="title"]')
  }

  static get observedAttributes() {
    return [
      'ax-title'
    ]
  }

  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-title': {
        this._titleEl.innerText = value
      }
      break
      default: return
    }
  }
}
window.customElements.define('ax-region', AXRegion)