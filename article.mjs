import AXRegion from './region.mjs'

export default class AXArticle extends AXRegion {
  constructor() {
    super()
    this._regionEl.setAttribute('role', 'article')
    this._titleEl.setAttribute('aria-level', '3') // TODO inherit?
  }
}

window.customElements.define('ax-article', AXArticle)