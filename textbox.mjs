import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    [data-el="input"] {
      display: block;
      width: 100px;
      height: 1em;
      padding: 4px;
      border: 1px solid;
      white-space: pre;
      overflow: auto;
    }
  </style>
  <span
    id="label"
    tabindex="-1"
    aria-hidden="true"
    data-el="label">
  </span>
  <span
    contenteditable
    tabindex="0"
    role="textbox"
    aria-labelledby="label"
    data-el="input">
  </span>
`
window.document.body.append(template)
window.customElements.define('ax-textbox', class extends AXElement {
  constructor() {
    super(template)
    this._labelEl = this.shadowRoot.querySelector('[data-el="label"]')
    this._inputEl = this.shadowRoot.querySelector('[data-el="input"]')
    this._labelEl.addEventListener('focus', () => {
      this._inputEl.focus()
    })
    this._inputEl.addEventListener('input', (event) => {
      if (event.inputType === 'insertParagraph') {
        const formEl = this.closest('ax-form, form')
        if (formEl) {
          formEl.dispatchEvent(new Event('submit'))
        }
      }
      this.setAttribute('ax-value', this._inputEl.innerText.trim())
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
      case 'ax-value': {
        this._inputEl.innerText = value
        this._inputEl.focus()
        window.document.execCommand('selectAll', false, null)
        window.document.getSelection().collapseToEnd()
      }
      break
      default: return
    }
  }
})