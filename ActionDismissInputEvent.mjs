const checkIfSupported = new Promise((resolve, reject) => {
  const dialogEl = window.document.createElement('dialog')
  dialogEl.style.visibility = 'hidden'
  window.document.body.append(dialogEl)
  dialogEl.addEventListener('input', ({ inputType }) => {
    if (inputType === 'actionDismiss') {
      resolve(true)
    }
  })
  dialogEl.addEventListener('keydown', ({ key }) => {
    if (key === 'Escape') {
      dialogEl.close()
      dialogEl.remove()
      setTimeout(() => {
        reject(false)
      })
    }
  })
  dialogEl.showModal(true)
  dialogEl.dispatchEvent(new (class extends KeyboardEvent {
    constructor() {
      super('keydown')
    }
    get key() {
      return 'Escape'
    }
    get bubbles() {
      return true
    }
  })())
})

export default class extends InputEvent {
  constructor() {
    super('input')
  }
  get inputType() {
    return 'actionDismiss'
  }
  get bubbles() {
    return true
  }
  static get checkSupport() {
    return checkIfSupported
  }
}