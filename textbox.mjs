import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    [data-el="wrapper"] {
      display: block;
      width: 100px;
      height: 1em;
      overflow: hidden;
      border: 1px solid;
      border-radius: var(--ax-input-border-radius, 0);
      padding: 4px;
      width: 100px;
    }
    [data-el="wrapper"]:focus-within {
      outline: 0;
      box-shadow: 0 0 0 4px var(--ax-focus-color, #63ADE5);
    }
    [data-el="input"] {
      display: inline-grid;
      font-family: var(--ax-input-font-family, sans-serif);
      color: var(--ax-input-color, black);
      white-space: nowrap;
      grid-auto-flow: column;
    }
    [data-el="input"]:focus {
      outline: 0;
    }
    [data-el="input"] * {
      display: none;
    }
  </style>
  <span
    id="label"
    tabindex="-1"
    aria-hidden="true"
    data-el="label">
  </span>
  <span
    role="presentation"
    data-el="wrapper">
    <span
      contenteditable
      tabindex="0"
      role="textbox"
      aria-labelledby="label"
      data-el="input">
    </span>
  </span>
`
window.document.body.append(template)
window.customElements.define('ax-textbox', class extends AXElement {
  constructor() {
    super(template)
    this._labelEl = this.shadowRoot.querySelector('[data-el="label"]')
    this._inputEl = this.shadowRoot.querySelector('[data-el="input"]')
    this._resetCursor = () => {
      window.document.execCommand('selectAll', false, null)
      window.document.getSelection().collapseToEnd()
    }
    this._inputEl.addEventListener('focus', () => {
      setTimeout(() => {
        this._resetCursor()
      })
    })
    this._labelEl.addEventListener('focus', () => {
      this._inputEl.focus()
    })
    this._inputEl.addEventListener('input', ({ inputType }) => {
      if (inputType === 'insertText') {
        this.setAttribute('ax-value', this._inputEl.innerText)
      } else {
        this._inputEl.innerText = this.getAttribute('ax-value')
      }
    })
    this._inputEl.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        const formEl = this.closest('ax-form, form')
        if (formEl) {
          formEl.dispatchEvent(new Event('submit'))
        }
      }
    })
  }

  static get observedAttributes() {
    return [,
      'ax-name',
      'ax-label',
      'ax-value'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-label': {
        this._labelEl.innerText = value
      }
      break
      default: return
    }
  }
})