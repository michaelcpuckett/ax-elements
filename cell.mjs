import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: grid;
      align-items: center;
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
    this.addEventListener('focus', () => {
      const focusableEl = this.querySelector('[tabindex="0"]')
      if (focusableEl) {
        focusableEl.focus()
        focusableEl.tabIndex = '0'
        this.removeAttribute('tabindex')
      }
    })
    this.addEventListener('click', () => {
      const rowEl = this.closest('ax-row')
      if (rowEl) {
        const gridEl = rowEl.closest('ax-grid')
        if (gridEl) {
          const activeCellEl = gridEl.querySelector('ax-cell[ax-active]')
          if (activeCellEl && activeCellEl !== this) {
            this.setAttribute('ax-active', '')
            activeCellEl.removeAttribute('ax-active')
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
              if (nextCellEl && nextCellEl !== this) {
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
              if (nextCellEl && nextCellEl !== this) {
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
        case 'PageUp': {
          const rowEl = this.closest('ax-row')
          if (rowEl) {
            const cellIndex = [...rowEl.children].indexOf(this)
            const gridEl = rowEl.closest('ax-grid')
            if (gridEl) {
              const firstRowEl = gridEl.querySelector('ax-row')
              if (firstRowEl) {
                const nextCellEl = firstRowEl.querySelector(`ax-cell:nth-child(${cellIndex + 1})`)
                if (nextCellEl && nextCellEl !== this) {
                  nextCellEl.setAttribute('ax-active', '')
                  nextCellEl.focus()
                  this.removeAttribute('ax-active')
                }
              }
            }
          }
        }
        break
        case 'PageDown': {
          const rowEl = this.closest('ax-row')
          if (rowEl) {
            const cellIndex = [...rowEl.children].indexOf(this)
            const gridEl = rowEl.closest('ax-grid')
            if (gridEl) {
              const lastRowEl = [...gridEl.querySelectorAll('ax-row')].pop()
              if (lastRowEl) {
                const nextCellEl = lastRowEl.querySelector(`ax-cell:nth-child(${cellIndex + 1})`)
                if (nextCellEl && nextCellEl !== this) {
                  nextCellEl.setAttribute('ax-active', '')
                  nextCellEl.focus()
                  this.removeAttribute('ax-active')
                }
              }
            }
          }
        }
        break
        case 'Home': {
          const rowEl = this.closest('ax-row')
          if (rowEl) {
            const gridEl = rowEl.closest('ax-grid')
            if (gridEl) {
              const firstCellEl = gridEl.querySelector('ax-cell')
              if (firstCellEl && firstCellEl !== this) {
                firstCellEl.setAttribute('ax-active', '')
                firstCellEl.focus()
                this.removeAttribute('ax-active')
              }
            }
          }
        }
        break
        case 'End': {
          const rowEl = this.closest('ax-row')
          if (rowEl) {
            const gridEl = rowEl.closest('ax-grid')
            if (gridEl) {
              const lastCellEl = [...gridEl.querySelectorAll('ax-cell')].pop()
              if (lastCellEl && lastCellEl !== this) {
                lastCellEl.setAttribute('ax-active', '')
                lastCellEl.focus()
                this.removeAttribute('ax-active')
              }
            }
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