class Vue {
  constructor(options) {
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string'
      ? document.querySelector(options.el)
      : options.el
    this._proxyData(this.$data)
    new Observer(this.$data)
    new Compiler(this)
  }
  _proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {          
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key]) return
          data[key] = newValue
        }
      })
    })
  }
}