class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  // 要传入val是因为如果通过data[key]获取会出现死递归
  // 当这个函数执行完了后，val就被释放了，为什么通过vm.msg可以获取
  // 因为get函数形成闭包，关联了val，扩展了val的作用域
  defineReactive(obj, key, val) {
    const that = this
    // 负责收集依赖，并发送通知
    let dep = new Dep()
    // 如果val是对象，把val内部的属性转换为响应式数据
    this.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      // 这里只是定义了set和get，并没有执行
      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set(newVal) {
        if (val === newVal) {
          return
        }
        val = newVal
        // 如果设置的属性为对象，转换为响应式数据
        that.walk(newVal)
        // 发送通知
        dep.notify()
      }
    })
  }
}