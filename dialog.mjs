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
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      grid-template-columns: calc(100% + 1px);
      grid-template-rows: calc(100% + 1px);
      overflow: scroll;
      overscroll-behavior: none;
    }
    [data-el="scrollable"] {
      display: grid;
      grid-column: 1 / -1;
      grid-row: 1 / -1;
      height: 100%;
      width: 100%;
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
      background-color: var(--ax-overlay-color, rgba(0, 0, 0, .667));
      overflow: scroll;
    }
    [data-el="dialog"] {
      z-index: 1;
      display: grid;
      grid-column: 1 / -1;
      grid-row: 1 / -1;
      grid-template-columns: minmax(0, 1fr) max-content;
      grid-template-rows: min-content minmax(0, 1fr);
      grid-gap: 12px;
      align-self: center;
      justify-self: center;
      padding: var(--ax-padding, 1em);
      max-height: var(--ax-max-height, 50vh);
      max-height: min(var(--ax-max-height, 50vh), 100%);
      width: var(--ax-width, 50vw);
      width: clamp(320px, var(--ax-width, 50vw), 100%);
      background-color: var(--ax-background-color, white);
      border-color: var(--ax-border-color, currentColor);
      border-radius: var(--ax-border-radius, 0);
      border-width: var(--ax-border-width, 2px);
      border-style: solid;
      outline: 0;
    }
    [data-el="headline"] {
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
  </style>
  <ax-view
    data-el="scrollable">
    <ax-view
      data-el="overlay">
    </ax-view>
    <ax-view
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby="headline"
      aria-describedby="body"
      data-el="dialog">
      <span
        role="heading"
        aria-level="1"
        data-el="headline"
        id="headline">
        <slot name="headline"></slot>
      </span>
      <ax-button
        ax-icon="close"
        data-el="close">
        <slot name="close">
          Close
        </slot>
      </ax-button>
      <ax-view
        data-el="body"
        id="body">
        <slot></slot>
      </ax-view>
    </ax-view>
  </ax-view>
`
window.document.body.append(template)

window.customElements.define('ax-dialog', class extends AXElement {
  constructor() {
    super(template)
    this._priorFocus = null
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
      'ax-name'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-open': {
        if (value || value === '') {
          this._priorFocus = window.document.activeElement
          setTimeout(() => {
            this.shadowRoot.querySelector('[data-el="close"]').focus()
            ;[...window.document.querySelectorAll('ax-landmark')].forEach(el => el.setAttribute('inert', ''))
          })
        } else {
          ;[...window.document.querySelectorAll('ax-landmark')].forEach(el => el.removeAttribute('inert'))
          this._priorFocus.focus()
          this._priorFocus = null
        }
      }
      break
      case 'ax-name': {
        this.shadowRoot.querySelector('slot[name="headline"]').innerText = value
      }
      break
      default: return
    }
  }
})