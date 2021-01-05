import AXRegion from './region.mjs'

export default class AXArticle extends AXRegion {
  constructor() {
    super()
    this._regionEl.setAttribute('role', 'article')
  }
}

window.customElements.define('ax-article', AXArticle)