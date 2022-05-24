class Compiler {
  constructor(vm) {
    this.vm = vm
    this.el = vm.$el
    this.compiler(this.el)
  }
  compiler(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compilerText(node)
      } else if (this.isElementNode(node)) {
        this.compilerElement(node)
      }
      // 如果node节点还有字节的，递归调用compiler
      if (node.childNodes && node.childNodes.length) {
        this.compiler(node)
      } 
    })
  }
  compilerElement(node) {
    // console.log(node.attributes)
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }
  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }
  // 处理v-text指令
  textUpdater(node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }
  // 处理v-model
  modelUpdater(node, value, key) {
    node.value = value
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
  compilerText(node) {
    // console.dir(node)
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      const key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      // 创建watcher对象，当数据变化更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
}