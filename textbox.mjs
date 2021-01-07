import AXElement from './element.mjs'
import AXError from './internal/Error.mjs'

const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const NUMBER_REGEXP = /^[0-9]+$/
const PHONE_NUMBER_REGEXP = /^[0-9\+\-\(\) ]+$/

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
      height: var(--ax-spacing, 1em);
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
    :host([ax-mask]) [data-el="input"] {
      -webkit-text-security: disc;
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
      this._updateSelection()
      // if (![
      //   'insertText',
      //   'insertReplacementText',
      //   'insertFromYank',
      //   'insertFromDrop',
      //   'insertFromPaste',
      //   'insertFromPasteAsQuotation', // ?
      //   'insertTranspose',
      //   'insertCompositionText', // ?

      //   'deleteSoftLineBackward',
      //   'deleteSoftLineForward',
      //   'deleteEntireSoftLine',
      //   'deleteHardLineBackward',
      //   'deleteHardLineForward',

      //   'deleteByDrag',
      //   'deleteByCut',
      //   'deleteByPaste',
      //   'deleteContent',
      //   'deleteContentBackward',
      //   'deleteContentForward',
      //   'deleteWordForward',
      //   'deleteWordBackward',

      //   'historyUndo',
      //   'historyRedo',

      //   'formatSetInlineTextDirection',
      //   'formatSetBlockTextDirection'
      // ].includes(event.inputType)) {
      //   event.preventDefault()
      // }
    })

    this._inputEl.addEventListener('input', event => {
      const splice = (value, sliceArgs) => {
        const iterable = value.split('')
        iterable.splice(...sliceArgs)
        return iterable.join('')
      }
      const isDeleting = [
        'deleteContentBackward',
        'deleteByDrag',
        'deleteByCut',
        'deleteByPaste',
        'deleteContent',
        'deleteContentBackward',
        'deleteContentForward',
        'deleteWordForward',
        'deleteWordBackward'
      ].includes(event.inputType)

      if (isDeleting) {
        this._updateSelection()
      }

      const hasSelection = this._startOffset !== this._endOffset
      const start = hasSelection ? this._startOffset : this._focusOffset
      const end = hasSelection ? this._endOffset : this._anchorOffset
      const length = end - start

      if (isDeleting) {
        this.value = splice(this.value || '', [
          end,
          this._anchorDiff * -1
        ])
      } else {
        this.value = splice(this.value || '', [
          start,
          length,
          ...event.data ? [
            event.data
          ] : []
        ])
      }

      this.setAttribute('ax-value', this.value)

      if (this.value) {
        this._validationEl.removeAttribute('hidden')
      } else {
        this._validationEl.setAttribute('hidden', 'hidden')
      }
    })

    this._inputEl.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        if (this.hasAttribute('ax-multiline')) {
          this._setValue((this.getAttribute('ax-value') || '') + '\n\n')
          this._resetCursor()
        } else {
          const formEl = this.closest('ax-form, form')
          if (formEl) {
            formEl.dispatchEvent(new CustomEvent('ax-submit'))
          }
        }
      }
    })
    this.addEventListener('invalid', () => {
      this._validationEl.removeAttribute('hidden')
    })
    this.reset = () => {
      this.dispatchEvent(new CustomEvent('ax-reset'))
    }
    this.addEventListener('ax-reset', () => {
      const resetEvent = new Event('reset', {
        cancelable: true
      })
      this.dispatchEvent(resetEvent)
      if (!resetEvent.defaultPrevented) {
        this._setValue('')
      }
    })
    this._updateSelection()
    window.document.addEventListener('selectionchange', () => {
      this._updateSelection()
    })
  }

  _updateSelection() {
    const selection = this.shadowRoot.getSelection()
    this._anchorDiff = (selection.anchorOffset || 0) - (this._anchorOffset || 0)
    this._anchorOffset = selection.anchorOffset
    this._focusDiff = (selection.focusOffset || 0) - (this._focusOffset || 0)
    this._focusOffset = selection.focusOffset
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0)
      this._startDiff = (range.startOffset || 0) - (this._startOffset || 0)
      this._startOffset = range.startOffset
      this._endDiff = (range.endOffset || 0) - (this._endOffset || 0)
      this._endOffset = range.endOffset
    } else {
      this._startDiff = 0 - (this._startOffset || 0)
      this._startOffset = null
      this._endDiff = 0 - (this._endOffset || 0)
      this._endOffset = null
    }
  }

  _setValue(value) {
    this._inputEl.innerText = value
    this.setAttribute('ax-value', value)
  }

  _getCursorPosition() {
    const range = this.shadowRoot.getSelection().getRangeAt(0)
    return range.endOffset
  }

  _getSelectionRange() {
    const range = this.shadowRoot.getSelection().getRangeAt(0)
    return {
      start: range.startOffset,
      end: range.endOffset
    }
  }

  _resetCursor() {
    window.document.execCommand('selectAll', false, null)
    window.document.getSelection().collapseToEnd()
  }

  _getValidationMessage() {
    const value = (this.getAttribute('ax-value') || '').trim()
    if (this.hasAttribute('ax-required')) {
      if (!value.length) {
        return 'This field needs to be filled out.'
      }
    }
    if (this.hasAttribute('ax-validation')) {
      switch (this.getAttribute('ax-validation')) {
        case 'email': {
          if (!value.match(EMAIL_REGEXP)) {
            return 'This field needs to be in email format.'
          }
        }
        break
        case 'number': {
          if (!value.match(NUMBER_REGEXP)) {
            return 'This field needs to be numbers only.'
          }
        }
        break
        case 'phone-number': {
          if (!value.match(PHONE_NUMBER_REGEXP)) {
            return 'This field needs to in phone number format.'
          }
        }
        break
        default: {
          if (!value.match(this.getAttribute('ax-validation'))) {
            return 'This field needs to be in the correct format.'
          }
        }
      }
    }
    const minLength = parseInt(this.getAttribute('ax-minlength'), 10) || -1
    if (value.length < minLength) {
      return `This field needs to have at least ${minLength} characters.`
    }
    const maxLength = parseInt(this.getAttribute('ax-maxlength'), 10) || Infinity
    if (value.length > maxLength) {
      return `This fields needs to have less than ${maxLength + 1} characters.`
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
      'ax-ref',
      'ax-label',
      'ax-value',
      'ax-required',
      'ax-disabled',
      'ax-placeholder',
      'ax-validation',
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
        this._placeholderEl.innerText = value
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
      case 'ax-validation': {
        if (value === 'phone-number') {
          if (!this.hasAttribute('ax-minlength')) {
            this.setAttribute('ax-minlength', '10')
          }
          if (!this.hasAttribute('ax-maxlength')) {
            this.setAttribute('ax-maxlength', '20')
          }
        } else {
          if (this.getAttribute('ax-minlength') === '10') {
            this.removeAttribute('ax-minlength')
          }
          if (this.getAttribute('ax-maxlength') === '20') {
            this.removeAttribute('ax-maxlength')
          }
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