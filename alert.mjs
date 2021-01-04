import AXElement from './element.mjs'
import DismissEvent from './internal/ActionDismissInputEvent.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(:not([ax-open])) {
      display: none !important;
    }
    :host([ax-open]) {
      display: grid;
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      justify-content: center;
      grid-template-columns: 100%;
      cursor: pointer;
    }
    [data-el="content"] {
      background: rgba(0, 0, 0, .667);
      color: white;
      padding: 20px;
      font-size: larger;
    }
  </style>
  <div
    data-el="content"
    hidden
    role="presentation">
    <slot></slot>
  </div>
`
window.document.body.append(template)

window.customElements.define('ax-alert', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'alert'
    this.tabIndex = '-1'
    this._contentEl = this.shadowRoot.querySelector('[data-el="content"]')
    this.addEventListener('scroll', () => {
      if (this.scrollTop || this.scrollLeft) {
        this.scrollTo(0, 0)
      }
    })
    this.addEventListener('input', ({ inputType }) => {
      if (inputType === 'actionDismiss') {
        this.removeAttribute('ax-open')
      }
    })
    this.addEventListener('click', () => {
      this.dispatchEvent(new DismissEvent())
    })
    DismissEvent.checkSupport.catch(() => {
      this.addEventListener('keydown', ({ key }) => {
        if (key === 'Escape') {
          this.dispatchEvent(new DismissEvent())
        }
      })
    })
  }
  static get observedAttributes() {
    return [
      'ax-open'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-open': {
        if (value || value === '') {
          setTimeout(() => {
            this._contentEl.removeAttribute('hidden')
            setTimeout(() => {
              this.removeAttribute('ax-open')
            }, 5000)
          }, 200)
        } else {
          this._contentEl.setAttribute('hidden', '')
        }
      }
      break
      default: return
    }
  }
})