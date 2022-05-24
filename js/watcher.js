class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    // data中的属性名称
    this.key = key
    // 回调函数负责更新视图
    this.cb = cb
    // 把watcher对象记录到Dep类的静态属性target中
    Dep.target = this
    // 触发get方法，在get中会掉用addSub收集依赖
    this.oldValue = vm[key]
    Dep.target = null
  }
  update() {
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) {
      return
    }
    this.cb(newValue)
  }
}