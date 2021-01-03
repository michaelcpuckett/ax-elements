export default class AXError extends Error {
  constructor(message) {
    super()
    this.name = 'AXError'
    this.message = message
  }
}