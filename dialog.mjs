import AXElement from './element.mjs'
import DismissEvent from './ActionDismissInputEvent.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(:not([ax-open])) {
      display: none !important;
    }
    :host([ax-open]) {
      display: grid;
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      grid-template-columns: 100%;
      grid-template-rows: 100%;
    }
    [data-el="overlay"] {
      grid-column: 1 / -1;
      grid-row: 1 / -1;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background-color: var(--overlay-color, rgba(0, 0, 0, .667));
    }
    [data-el="dialog"] {
      display: grid;
      grid-column: 1 / -1;
      grid-row: 1 / -1;
      grid-template-columns: minmax(0, 1fr) max-content;
      grid-template-rows: min-content minmax(0, 1fr);
      grid-gap: 12px;
      align-self: center;
      justify-self: center;
      padding: var(--padding, 20px);
      max-height: min(var(--max-height, 500px), 100%);
      width: min(var(--width, 500px), 100%);
      background-color: var(--background-color, white);
      border-color: var(--border-color, magenta);
      border-radius: var(--border-radius, 4px);
      border-width: var(--border-width, 2px);
      border-style: solid;
      outline: 0;
    }
    [data-el="title"] {
      grid-column: 1 / 2;
      margin: 0;
      font-size: x-large;
    }
    [data-el="close"] {
      grid-column: 2 / 3;
    }
    [data-el="body"] {
      grid-column: 1 / 3;
    }

    slot[name="body"]::slotted(div),
    slot[name="body"]::slotted(br),
    slot[name="body"]::slotted(h1),
    slot[name="body"]::slotted(main),
    slot[name="body"]::slotted(section),
    slot[name="body"]::slotted(article),
    slot[name="body"]::slotted(nav),
    slot[name="body"]::slotted(aside),
    slot[name="body"]::slotted(header),
    slot[name="body"]::slotted(footer) {
      display: none;
    }
  </style>
  <div
    data-el="overlay"
    role="presentation">
  </div>
  <div
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-labelledby="title"
    aria-describedby="body"
    data-el="dialog"
    role="presentation">
    <h1
      slot="title"
      data-el="title"
      id="title">
    </h1>
    <ax-button
      slot="close"
      ax-icon="close"
      ax-label="Close"
      ax-hide-label
      data-el="close">
    </ax-button>
    <div
      data-el="body"
      role="presentation"
      id="body">
      <slot name="body"></slot>
    </div>
  </div>
`
window.document.body.append(template)

window.customElements.define('ax-dialog', class extends AXElement {
  constructor() {
    super(template)
    this._priorFocus = null
    this.addEventListener('input', ({ inputType }) => {
      if (inputType === 'actionDismiss') {
        this.removeAttribute('ax-open')
      }
    })
    this.shadowRoot.querySelector('[data-el="close"]').addEventListener('click', () => {
      this.dispatchEvent(new DismissEvent())
    })
    this.shadowRoot.querySelector('[data-el="overlay"]').addEventListener('click', () => {
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
      'ax-open',
      'ax-title'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-open': {
        if (value === 'true' || value === 'open' || value === '') {
          this._priorFocus = window.document.activeElement
          setTimeout(() => {
            this.shadowRoot.querySelector('[data-el="close"]').focus()
            const mainEl = window.document.querySelector('ax-main, main')
            if (mainEl) {
              mainEl.setAttribute('inert', '')
            }
          })
        } else if (!value && value !== '') {
          const mainEl = window.document.querySelector('ax-main, main')
          if (mainEl) {
            mainEl.removeAttribute('inert')
          }
          this._priorFocus.focus()
          this._priorFocus = null
        }
      }
      break
      case 'ax-title': {
        this.shadowRoot.querySelector('[data-el="title"]').innerHTML = value
      }
      break
      default: return
    }
  }
})