import AXElement from './element.mjs'

const template = window.document.createElement('template')
template.innerHTML = `
  <style>
    :host(*) {
      display: contents;
    }
    [data-el="unloaded"]:not([hidden]),
    [data-el="loaded"]:not([hidden]) {
      grid-gap: var(--ax-spacing, 1em);
      display: grid;
    }
  </style>
  <ax-view
    data-el="unloaded">
    <slot>
      Loading...
    </slot>
  </ax-view>
  <ax-view
    data-el="loaded"
    part="loaded"
    hidden>
  </ax-view>
`
window.document.body.append(template)
window.customElements.define('ax-embed', class extends AXElement {
  constructor() {
    super(template)
    this.role = 'presentation'
    this._unloadedEl = this.shadowRoot.querySelector('[data-el="unloaded"]')
    this._loadedEl = this.shadowRoot.querySelector('[data-el="loaded"]')
    const url = new URL(this.getAttribute('ax-url'), window.document.location)
    this.addEventListener('ax-show-unloaded', () => {
      this._unloadedEl.removeAttribute('hidden')
      this._loadedEl.setAttribute('hidden', '')
    })
    this.addEventListener('ax-show-loaded', () => {
      this._unloadedEl.setAttribute('hidden', '')
      this._loadedEl.removeAttribute('hidden')
    })
    fetch(`${url}`, {
      headers: {
        'Content-Type': 'text/html'
      }
    })
    .then(res => {
      if (res.ok) {
        return res.text()
      } else {
        throw new Error(res.status)
      }
    })
    .then(result => {
      this.result = result
      const loadEvent = new Event('load', {
        cancelable: true
      })
      this.dispatchEvent(loadEvent)
      if (!loadEvent.defaultPrevented) {
        const templateEl = window.document.createElement('template')
        templateEl.innerHTML = this.result
        const children = [...templateEl.content.children]
        children.forEach(el => {
          if (![
            'script',
            'link'
          ].includes(el.tagName.toLowerCase())) {
            this._loadedEl.append(el)
          }
        })
        this._onLoad()
        this.dispatchEvent(new CustomEvent('ax-show-loaded'))
      }
    })
    .catch(error => {
      this.dispatchEvent(new ErrorEvent('error', {
        error
      }))
    })
  }

  get nextRole() {
    return this.getAttribute('ax-internal-role')
  }

  get nextLevel() {
    return `${parseInt(this.getAttribute('ax-internal-level') || 1, 10)}`
  }

  _onLoad() {
    setTimeout(() => {
      ;[...this.shadowRoot.querySelectorAll('ax-landmark,ax-embed')].forEach(el => {
        el.setAttribute('ax-internal-role', this.nextRole)
        el.setAttribute('ax-internal-level', this.nextLevel)
      })
    })
  }
})