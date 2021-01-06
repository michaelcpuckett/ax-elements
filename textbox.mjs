import AXElement from './element.mjs'
import AXError from './internal/Error.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: grid;
      grid-auto-flow: var(--ax-orientation, row);
      grid-auto-columns: var(--ax-columns, auto minmax(0, 1fr));
      grid-gap: var(--ax-gap, 0);
      align-items: center;
    }
    [data-el="label"] {
      cursor: pointer;
    }
    [data-el="wrapper"] {
      display: grid;
      align-items: center;
      font-family: var(--ax-input-font-family, sans-serif);
      font-size: var(--ax-font-size, medium);
      color: var(--ax-input-color, black);
      border: 1px solid;
      border-radius: var(--ax-input-border-radius, 0);
      padding: var(--ax-input-padding, 4px);
      width: 100%;
      position: relative;
      height: 1em;
      overflow: hidden;
    }
    :host([ax-multiline]) [data-el="wrapper"] {
      height: auto;
      min-height: 4em;
      resize: both;
      align-items: flex-start;
    }
    [data-el="wrapper"]:focus-within {
      outline: 0;
      box-shadow: 0 0 0 4px var(--ax-focus-color, #63ADE5);
    }
    [data-el="input"] {
      display: inline-grid;
      white-space: nowrap;
      grid-auto-flow: column;
      align-items: center;
      grid-column: 1 / -1;
      grid-row: 1 / -1;
    }
    :host([ax-multiline]) [data-el="input"] {
      display: grid;
      white-space: pre;
      resize: auto;
      height: 100%;
      align-items: flex-start;
    }
    [data-el="input"]:focus {
      outline: 0;
    }
    [data-el="input"] * {
      display: none;
    }
    :host([ax-multiline]) [data-el="input"] br {
      display: grid;
    }
    [data-el="placeholder"]:not([hidden]) {
      display: inline-grid;
    }
    [data-el="placeholder"] {
      grid-column: 1 / -1;
      grid-row: 1 / -1;
      white-space: nowrap;
      align-items: center;
      color: var(--ax-placeholder-color, gray);
      pointer-events: none;
    }
    :host([ax-multiline]) [data-el="wrapper"] {
      white-space: pre;
    }
    [data-el="validation"]:not([hidden]) {
      display: grid;
    }
    [data-el="validation"] {
      color: red;
    }
  </style>
  <ax-text
    id="label"
    tabindex="-1"
    aria-hidden="true"
    data-el="label">
  </ax-text>
  <ax-text
    data-el="wrapper">
    <ax-text
      hidden
      aria-hidden="true"
      data-el="placeholder">
    </ax-text>
    <span
      contenteditable
      tabindex="0"
      role="textbox"
      aria-labelledby="label"
      aria-describedby="validation"
      data-el="input">
    </span>
  </ax-text>
  <ax-text
    id="validation"
    hidden
    aria-hidden="true"
    data-el="validation">
  </ax-text>
`
window.document.body.append(template)
window.customElements.define('ax-textbox', class AXTextbox extends AXElement {
  constructor() {
    super(template)
    this._labelEl = this.shadowRoot.querySelector('[data-el="label"]')
    this._inputEl = this.shadowRoot.querySelector('[data-el="input"]')
    this._placeholderEl = this.shadowRoot.querySelector('[data-el="placeholder"]')
    this._validationEl = this.shadowRoot.querySelector('[data-el="validation"]')
    this._inputEl.innerText = this.getAttribute('ax-value') || ''
    this._inputEl.addEventListener('focus', () => {
      setTimeout(() => {
        if (window.document.activeElement === this) {
          this._resetCursor()
        }
      })
    })
    this._labelEl.addEventListener('focus', () => {
      this._inputEl.focus()
    })
    this._inputEl.addEventListener('beforeinput', event => {
      console.log('>', event.inputType)
      if (![
        'insertText',
        'insertReplacementText',
        'insertFromYank',
        'insertFromDrop',
        'insertFromPaste',
        'insertFromPasteAsQuotation', // ?
        'insertTranspose',
        'insertCompositionText', // ?

        'deleteSoftLineBackward',
        'deleteSoftLineForward',
        'deleteEntireSoftLine',
        'deleteHardLineBackward',
        'deleteHardLineForward',

        'deleteByDrag',
        'deleteByCut',
        'deleteByPaste',
        'deleteContent',
        'deleteContentBackward',
        'deleteContentForward',
        'deleteWordForward',
        'deleteWordBackward',

        'historyUndo',
        'historyRedo',

        'formatSetInlineTextDirection',
        'formatSetBlockTextDirection'
      ].includes(event.inputType)) {
        event.preventDefault()
      }
    })
    this._inputEl.addEventListener('input', () => {
      this.setAttribute('ax-value', this._inputEl.innerText)
      this._validationEl.setAttribute('hidden', 'hidden')
    })
    this._inputEl.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        if (this.hasAttribute('ax-multiline')) {
          this._inputEl.innerText = (this.getAttribute('ax-value') || '') + '\n\n'
          this.setAttribute('ax-value', (this.getAttribute('ax-value') || '') + '\n\n')
          this._resetCursor()
        } else {
          const formEl = this.closest('ax-form, form')
          if (formEl) {
            formEl.dispatchEvent(new Event('ax-submit'))
          }
        }
      }
    })
    this.addEventListener('invalid', () => {
      this._validationEl.removeAttribute('hidden')
    })
  }

  _resetCursor() {
    window.document.execCommand('selectAll', false, null)
    window.document.getSelection().collapseToEnd()
  }

  _getValidationMessage() {
    const value = (this.getAttribute('ax-value') || '').trim()
    if (this.hasAttribute('ax-required')) {
      if (!value.length) {
        return 'This field is required.'
      }
    }
    return ''
  }

  _checkValidity() {
    const validationMessage = this._getValidationMessage()
    if (validationMessage) {
      this.setAttribute('ax-internal-invalid', '')
      this._validationEl.innerText = validationMessage
    } else {
      this.removeAttribute('ax-internal-invalid')
      this._validationEl.innerText = ''
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('ax-label')) {
      this.remove()
      throw new AXError('<ax-textbox> requires ax-label attribute')
    }
  }

  static get observedAttributes() {
    return [,
      'ax-name',
      'ax-label',
      'ax-value',
      'ax-required',
      'ax-disabled',
      'ax-placeholder',
      'ax-multiline',
      'ax-internal-invalid'
    ]
  }
  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-label': {
        if (value) {
          this._labelEl.innerText = value
        } else {
          this.remove()
          throw new AXError('<ax-textbox> requires ax-label attribute')
        }
      }
      break
      case 'ax-value': {
        if (value) {
          this._placeholderEl.setAttribute('hidden', '')
        } else {
          this._placeholderEl.removeAttribute('hidden')
        }
        this._checkValidity()
      }
      break
      case 'ax-placeholder': {
        if (value) {
          this._placeholderEl.innerText = value
          this._placeholderEl.removeAttribute('hidden')
        } else {
          this._placeholderEl.setAttribute('hidden', '')
        }
      }
      break
      case 'ax-disabled': {
        if (value || value === '') {
          this._inputEl.removeAttribute('contenteditable')
          this._inputEl.setAttribute('aria-disabled', 'true')
        } else {
          this._inputEl.setAttribute('contenteditable', '')
          this._inputEl.removeAttribute('aria-disabled')
        }
      }
      break
      case 'ax-required': {
        if (value || value === '') {
          this._inputEl.setAttribute('aria-required', 'true')
          this._checkValidity()
        } else {
          this._inputEl.removeAttribute('aria-required')
          this._checkValidity()
        }
      }
      break
      case 'ax-multiline': {
        if (value || value === '') {
          this._inputEl.setAttribute('aria-multiline', 'true')
        } else {
          this._inputEl.removeAttribute('aria-multiline')
        }
      }
      break
      case 'ax-internal-invalid': {
        if (value || value === '') {
          this._inputEl.setAttribute('aria-invalid', 'true')
        } else {
          this._inputEl.removeAttribute('aria-invalid')
        }
      }
      break
      default: return
    }
  }
})