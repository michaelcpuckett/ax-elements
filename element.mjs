export default class AXElement extends HTMLElement {
  constructor(template) {
    super()
    if (template) {
      const contents = template.content.cloneNode(true)
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.append(contents)
    }
  }
  get role() {
    return this.getAttribute('role')
  }
  set role(role) {
    this.setAttribute('role', role)
  }
  get ariaHidden() {
    return this.getAttribute('aria-hidden')
  }
  set ariaHidden(ariaHidden) {
    this.setAttribute('aria-hidden', ariaHidden)
  }
  get ariaDisabled() {
    return this.getAttribute('aria-disabled')
  }
  set ariaDisabled(ariaDisabled) {
    this.setAttribute('aria-disabled', ariaDisabled)
  }
  get ariaPressed() {
    return this.getAttribute('aria-pressed')
  }
  set ariaPressed(ariaPressed) {
    this.setAttribute('aria-pressed', ariaPressed)
  }
  get ariaExpanded() {
    return this.getAttribute('aria-expanded')
  }
  set ariaExpanded(ariaExpanded) {
    this.setAttribute('aria-expanded', ariaExpanded)
  }
  get ariaModal() {
    return this.getAttribute('aria-modal')
  }
  set ariaModal(ariaModal) {
    this.setAttribute('aria-modal', ariaModal)
  }
  get ariaLabel() {
    return this.getAttribute('aria-label')
  }
  set ariaLabel(ariaLabel) {
    this.setAttribute('aria-label', ariaLabel)
  }
  get ariaLabelledBy() {
    return this.getAttribute('aria-labelledby')
  }
  set ariaLabelledBy(ariaLabelledBy) {
    this.setAttribute('aria-labelledby', ariaLabelledBy)
  }
  get ariaDescribedBy() {
    return this.getAttribute('aria-describedby')
  }
  set ariaDescribedBy(ariaDescribedBy) {
    this.setAttribute('aria-describedby', ariaDescribedBy)
  }
  get ariaHasPopup() {
    return this.getAttribute('aria-haspopup')
  }
  set ariaHasPopup(ariaHasPopup) {
    this.setAttribute('aria-haspopup', ariaHasPopup)
  }
}