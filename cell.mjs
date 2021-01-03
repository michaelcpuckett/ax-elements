import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: grid;
    }
  </style>
  <slot></slot>
`
window.document.body.append(template)
window.customElements.define('ax-cell', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'cell'
    this.tabIndex = '-1'
    this.addEventListener('click', () => {
      const rowEl = this.closest('ax-row')
      if (rowEl) {
        const gridEl = rowEl.closest('ax-grid')
        if (gridEl) {
          const activeCellEl = gridEl.querySelector('ax-cell[ax-active]')
          if (activeCellEl && activeCellEl !== this) {
            this.setAttribute('ax-active', '')
            this.tabIndex = '0'
            activeCellEl.removeAttribute('ax-active')
            activeCellEl.tabIndex = '-1'
          }
        }
      }
    })
    this.addEventListener('keydown', event => {
      switch (event.key) {
        case 'ArrowUp': {
          const rowEl = this.closest('ax-row')
          const cellIndex = [...rowEl.children].indexOf(this)
          if (rowEl) {
            const prevRowEl = rowEl.previousElementSibling
            if (prevRowEl) {
              const nextCellEl = prevRowEl.querySelector(`ax-cell:nth-of-type(${cellIndex + 1})`)
              if (nextCellEl) {
                event.preventDefault()
                nextCellEl.setAttribute('ax-active', '')
                nextCellEl.focus()
                this.removeAttribute('ax-active')
              }
            }
          }
        }
        break
        case 'ArrowDown': {
          const rowEl = this.closest('ax-row')
          const cellIndex = [...rowEl.children].indexOf(this)
          if (rowEl) {
            const nextRowEl = rowEl.nextElementSibling
            if (nextRowEl) {
              const nextCellEl = nextRowEl.querySelector(`ax-cell:nth-of-type(${cellIndex + 1})`)
              if (nextCellEl) {
                event.preventDefault()
                nextCellEl.setAttribute('ax-active', '')
                nextCellEl.focus()
                this.removeAttribute('ax-active')
              }
            }
          }
        }
        break
        case 'ArrowLeft': {
          const prevCellEl = this.previousElementSibling
          if (prevCellEl) {
            event.preventDefault()
            prevCellEl.setAttribute('ax-active', '')
            prevCellEl.focus()
            this.removeAttribute('ax-active')
          }
        }
        break
        case 'ArrowRight': {
          const nextCellEl = this.nextElementSibling
          if (nextCellEl) {
            event.preventDefault()
            nextCellEl.setAttribute('ax-active', '')
            nextCellEl.focus()
            this.removeAttribute('ax-active')
          }
        }
        break
        default: return
      }
    })
  }

  static get observedAttributes() {
    return [
      'ax-active'
    ]
  }

  attributeChangedCallback(attributeName, prev, value) {
    switch (attributeName) {
      case 'ax-active': {
        if (value || value === '') {
          this.tabIndex = '0'
        } else {
          this.tabIndex = '-1'
        }
      }
      break
      default: return
    }
  }
})